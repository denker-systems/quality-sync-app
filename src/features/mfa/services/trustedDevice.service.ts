/**
 * Trusted Device Service - Manages device trust for MFA bypass
 * Allows users to skip MFA verification for a configured period (e.g., 6 hours)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/config/supabase';
import { Platform } from 'react-native';

const DEVICE_HASH_KEY = '@mfa_device_hash';

// Simple hash function for device identification
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + Date.now().toString(36);
}

class TrustedDeviceService {
  private deviceHash: string | null = null;

  /**
   * Generate a unique device hash based on device characteristics
   */
  async getDeviceHash(): Promise<string> {
    if (this.deviceHash) return this.deviceHash;

    // Try to get cached hash first
    const cached = await AsyncStorage.getItem(DEVICE_HASH_KEY);
    if (cached) {
      this.deviceHash = cached;
      return cached;
    }

    // Generate new hash based on platform info
    const deviceInfo = [
      Platform.OS,
      Platform.Version?.toString() || 'unknown',
      Date.now().toString(),
      Math.random().toString(),
    ].join('|');

    const hash = simpleHash(deviceInfo);

    // Cache the hash
    await AsyncStorage.setItem(DEVICE_HASH_KEY, hash);
    this.deviceHash = hash;

    return hash;
  }

  /**
   * Get device name for display
   */
  getDeviceName(): string {
    return `${Platform.OS} ${Platform.Version || ''}`.trim() || 'Mobile Device';
  }

  /**
   * Check if current device is trusted for a user
   */
  async isDeviceTrusted(userId: string): Promise<boolean> {
    try {
      const deviceHash = await this.getDeviceHash();

      // Use 'any' cast since trusted_devices table may not be in generated types
      const { data, error } = await (supabase as any)
        .from('trusted_devices')
        .select('id, expires_at')
        .eq('user_id', userId)
        .eq('device_hash', deviceHash)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error('❌ Error checking trusted device:', error);
        return false;
      }

      if (data) {
        console.log('✅ Device is trusted until:', data.expires_at);
        // Update last_used_at
        await (supabase as any)
          .from('trusted_devices')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', data.id);
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Error in isDeviceTrusted:', err);
      return false;
    }
  }

  /**
   * Trust the current device for a specified number of hours
   */
  async trustDevice(userId: string, hoursToTrust: number = 6): Promise<boolean> {
    try {
      const deviceHash = await this.getDeviceHash();
      const deviceName = this.getDeviceName();
      const expiresAt = new Date(Date.now() + hoursToTrust * 60 * 60 * 1000);

      console.log(`🔐 Trusting device for ${hoursToTrust} hours until:`, expiresAt);

      // Upsert trusted device (use 'any' cast since table may not be in generated types)
      const { error } = await (supabase as any).from('trusted_devices').upsert(
        {
          user_id: userId,
          device_hash: deviceHash,
          device_name: deviceName,
          expires_at: expiresAt.toISOString(),
          last_used_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,device_hash',
        },
      );

      if (error) {
        console.error('❌ Error trusting device:', error);
        return false;
      }

      console.log('✅ Device trusted successfully');
      return true;
    } catch (err) {
      console.error('❌ Error in trustDevice:', err);
      return false;
    }
  }

  /**
   * Remove trust for current device
   */
  async untrustDevice(userId: string): Promise<void> {
    try {
      const deviceHash = await this.getDeviceHash();

      await (supabase as any)
        .from('trusted_devices')
        .delete()
        .eq('user_id', userId)
        .eq('device_hash', deviceHash);

      console.log('✅ Device untrusted');
    } catch (err) {
      console.error('❌ Error untrusting device:', err);
    }
  }

  /**
   * Get trusted device hours from company security settings
   */
  async getTrustedDeviceHours(companyId: string): Promise<number> {
    try {
      const { data, error } = await (supabase as any)
        .from('companies')
        .select('security_settings')
        .eq('id', companyId)
        .single();

      if (error || !data) {
        return 6; // Default to 6 hours
      }

      const settings = data?.security_settings as Record<string, unknown> | null;
      return (settings?.mfa_trusted_device_hours as number) || 6;
    } catch {
      return 6; // Default to 6 hours
    }
  }
}

export const trustedDeviceService = new TrustedDeviceService();

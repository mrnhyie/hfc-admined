const PLATFORMS = [
  { key: 'facebook_url', label: 'Facebook', icon: 'facebook' },
  { key: 'instagram_url', label: 'Instagram', icon: 'instagram' },
  { key: 'youtube_url', label: 'YouTube', icon: 'youtube' },
  { key: 'tiktok_url', label: 'TikTok', icon: 'tiktok' },
];

export function socialLinks(settings) {
  return PLATFORMS.map((platform) => ({
    label: platform.label,
    icon: platform.icon,
    href: settings[platform.key],
  })).filter((link) => link.href);
}

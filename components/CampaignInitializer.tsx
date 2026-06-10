'use client';

import { useEffect } from 'react';
import { useCampaignStore } from '@/store/campaignStore';
import type { Campaign } from '@/types';

export default function CampaignInitializer({ campaigns }: { campaigns: Campaign[] }) {
  const setCampaigns = useCampaignStore((s) => s.setCampaigns);

  useEffect(() => {
    setCampaigns(campaigns);
  }, [campaigns, setCampaigns]);

  return null;
}

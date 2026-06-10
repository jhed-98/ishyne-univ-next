import { create } from 'zustand';
import type { Campaign } from '@/types';

interface CampaignState {
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  // Returns the active campaign that applies to a given product category
  getActiveCampaign: (categoria: string) => Campaign | null;
  // Returns the discounted price for a product
  applyDiscount: (price: number, categoria: string) => number;
  // Returns the discount percentage for a product
  getDiscountPercent: (categoria: string) => number;
  // Returns active banner campaign
  getBannerCampaign: () => Campaign | null;
}

function isCampaignActive(campaign: Campaign): boolean {
  if (!campaign.activa) return false;
  const now = Date.now();
  const start = new Date(campaign.fecha_inicio).getTime();
  const end = new Date(campaign.fecha_fin).getTime();
  return now >= start && now <= end;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],

  setCampaigns: (campaigns) => set({ campaigns }),

  getActiveCampaign: (categoria) => {
    const { campaigns } = get();
    // Find campaign that applies to this category (specific > all)
    const specific = campaigns.find(
      (c) => isCampaignActive(c) && c.alcance === categoria
    );
    if (specific) return specific;
    const global = campaigns.find(
      (c) => isCampaignActive(c) && c.alcance === 'all'
    );
    return global ?? null;
  },

  applyDiscount: (price, categoria) => {
    const campaign = get().getActiveCampaign(categoria);
    if (!campaign) return price;
    return Math.round(price * (1 - campaign.descuento / 100) * 100) / 100;
  },

  getDiscountPercent: (categoria) => {
    const campaign = get().getActiveCampaign(categoria);
    return campaign ? campaign.descuento : 0;
  },

  getBannerCampaign: () => {
    const { campaigns } = get();
    return campaigns.find(isCampaignActive) ?? null;
  },
}));

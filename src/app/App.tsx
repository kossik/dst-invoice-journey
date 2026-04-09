import { Routes, Route, Navigate } from "react-router-dom";
import { SuperHeader } from "@/components/SuperHeader";
import { CreatorLayout } from "@/features/creator/CreatorLayout";
import { CreatorDashboard } from "@/features/creator/pages/CreatorDashboard";
import { CreatorQuotes } from "@/features/creator/pages/CreatorQuotes";
import { QuoteDetail } from "@/features/creator/pages/QuoteDetail";
import { CreatorOffers } from "@/features/creator/pages/CreatorOffers";
import { CreatorAnalytics } from "@/features/creator/pages/CreatorAnalytics";
import { CreatorIntegrations } from "@/features/creator/pages/CreatorIntegrations";
import { CreatorCalendar } from "@/features/creator/pages/CreatorCalendar";
import { CreatorClients } from "@/features/creator/pages/CreatorClients";
import { CreatorPayouts } from "@/features/creator/pages/CreatorPayouts";
import { BrandLayout } from "@/features/brand/BrandLayout";
import { BrandDashboard } from "@/features/brand/pages/BrandDashboard";
import { BrandStorefront } from "@/features/brand/pages/BrandStorefront";
import { BrandCreatorDetail } from "@/features/brand/pages/BrandCreatorDetail";
import { BrandQuotes } from "@/features/brand/pages/BrandQuotes";
import { BrandQuoteDetail } from "@/features/brand/pages/BrandQuoteDetail";
import { BrandInvoices } from "@/features/brand/pages/BrandInvoices";
import { PublicCreatorPage } from "@/features/brand/pages/PublicCreatorPage";
import { InvoicePage } from "@/features/invoice/InvoicePage";

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <SuperHeader />
      <Routes>
        {/* Creator cabinet */}
        <Route path="/creator" element={<CreatorLayout />}>
          <Route index element={<CreatorDashboard />} />
          <Route path="calendar" element={<CreatorCalendar />} />
          <Route path="clients" element={<CreatorClients />} />
          <Route path="quotes" element={<CreatorQuotes />} />
          <Route path="quotes/:id" element={<QuoteDetail />} />
          <Route path="offers" element={<CreatorOffers />} />
          <Route path="payouts" element={<CreatorPayouts />} />
          <Route path="analytics" element={<CreatorAnalytics />} />
          <Route path="integrations" element={<CreatorIntegrations />} />
        </Route>

        {/* Brand cabinet (logged-in) */}
        <Route path="/brand" element={<BrandLayout />}>
          <Route index element={<BrandDashboard />} />
          <Route path="storefront" element={<BrandStorefront />} />
          <Route path="storefront/:creatorId" element={<BrandCreatorDetail />} />
          <Route path="quotes" element={<BrandQuotes />} />
          <Route path="quotes/:id" element={<BrandQuoteDetail />} />
          <Route path="invoices" element={<BrandInvoices />} />
        </Route>

        {/* Public creator page (unregistered brand) */}
        <Route path="/p/:creatorId" element={<PublicCreatorPage />} />

        {/* Public invoice (accessible by brand without auth) */}
        <Route path="/invoice/:invoiceId" element={<InvoicePage />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/creator" replace />} />
      </Routes>
    </div>
  );
}

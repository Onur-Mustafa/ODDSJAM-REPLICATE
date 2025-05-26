
import { OddsTable } from "@/components/odds-table";
import { MOCK_SPORTS, MOCK_MARKETS, MOCK_BOOKMAKERS } from "@/data/mock-data";

export default function OddsDashboardPage() {
  return (
    <div className="space-y-6">
      <OddsTable 
        sports={MOCK_SPORTS}
        markets={MOCK_MARKETS}
        bookmakers={MOCK_BOOKMAKERS}
      />
    </div>
  );
}

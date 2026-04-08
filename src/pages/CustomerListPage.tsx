import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customersListData } from "@/lib/mockData";

type SortKey = "name" | "segment" | "accounts" | "totalBalance" | "totalRevenue" | "trnVolume" | "creditScore";

const CustomerListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalRevenue");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = customersListData.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q)
    );
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "string" ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [search, sortKey, sortAsc]);

  const SortHeader = ({ label, col }: { label: string; col: SortKey }) => (
    <TableHead className="text-xs cursor-pointer select-none hover:text-foreground" onClick={() => handleSort(col)}>
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === col ? "text-primary" : "text-muted-foreground/50"}`} />
      </span>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Customer 360° View</h2>
        <p className="text-sm text-muted-foreground">Select a customer to view their full profile</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name, ID, or segment..." className="pl-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border border-border bg-card animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHeader label="Customer" col="name" />
              <SortHeader label="Segment" col="segment" />
              <TableHead className="text-xs">Branch</TableHead>
              <SortHeader label="Accounts" col="accounts" />
              <SortHeader label="Total Balance" col="totalBalance" />
              <SortHeader label="Revenue" col="totalRevenue" />
              <SortHeader label="TRN Vol" col="trnVolume" />
              <SortHeader label="Credit Score" col="creditScore" />
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate(`/customer-360/${c.id}`)}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{c.id}</p>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px]">{c.segment}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.branch}</TableCell>
                <TableCell className="text-sm text-center">{c.accounts}</TableCell>
                <TableCell className="text-sm text-right font-medium">₹{c.totalBalance.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-right font-medium">₹{c.totalRevenue.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-right">{c.trnVolume}</TableCell>
                <TableCell className="text-sm text-center">
                  <span className={c.creditScore >= 750 ? "text-success font-medium" : c.creditScore >= 700 ? "text-foreground" : "text-warning font-medium"}>
                    {c.creditScore}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={`text-[10px] ${c.status === "Active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerListPage;

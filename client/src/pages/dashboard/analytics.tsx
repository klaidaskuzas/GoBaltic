import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, DonutChart } from "@tremor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Users, MousePointer, Clock, ArrowUpRight, 
  ArrowDownRight, BarChart3, Download 
} from "lucide-react";

// Mock data for website analytics
const websiteVisitsData = [
  { date: "Jan 01", visits: 243, pageViews: 1420, uniqueVisitors: 195 },
  { date: "Jan 08", visits: 276, pageViews: 1680, uniqueVisitors: 234 },
  { date: "Jan 15", visits: 325, pageViews: 1984, uniqueVisitors: 287 },
  { date: "Jan 22", visits: 340, pageViews: 2130, uniqueVisitors: 305 },
  { date: "Jan 29", visits: 358, pageViews: 2260, uniqueVisitors: 318 },
  { date: "Feb 05", visits: 356, pageViews: 2170, uniqueVisitors: 315 },
  { date: "Feb 12", visits: 398, pageViews: 2480, uniqueVisitors: 345 },
  { date: "Feb 19", visits: 420, pageViews: 2650, uniqueVisitors: 362 },
  { date: "Feb 26", visits: 387, pageViews: 2390, uniqueVisitors: 329 },
  { date: "Mar 05", visits: 410, pageViews: 2570, uniqueVisitors: 352 },
  { date: "Mar 12", visits: 452, pageViews: 2840, uniqueVisitors: 395 },
  { date: "Mar 19", visits: 478, pageViews: 3040, uniqueVisitors: 412 },
  { date: "Mar 26", visits: 470, pageViews: 2980, uniqueVisitors: 408 },
  { date: "Apr 02", visits: 501, pageViews: 3240, uniqueVisitors: 436 },
];

const trafficSourcesData = [
  { source: "Organic Search", value: 45 },
  { source: "Direct", value: 30 },
  { source: "Social Media", value: 15 },
  { source: "Referral", value: 8 },
  { source: "Email", value: 2 },
];

const conversionRateData = [
  { date: "Jan", rate: 2.4 },
  { date: "Feb", rate: 2.7 },
  { date: "Mar", rate: 3.2 },
  { date: "Apr", rate: 3.8 },
];

const deviceData = [
  { device: "Desktop", percentage: 58 },
  { device: "Mobile", percentage: 36 },
  { device: "Tablet", percentage: 6 },
];

const popularPagesData = [
  { page: "Homepage", views: 12540, avgTime: "01:42" },
  { page: "Services", views: 8720, avgTime: "02:15" },
  { page: "About Us", views: 5430, avgTime: "01:36" },
  { page: "Contact", views: 4320, avgTime: "01:05" },
  { page: "Tracking", views: 7680, avgTime: "02:32" },
];

const demographicsData = [
  { country: "Lithuania", users: 5240, percentage: 28 },
  { country: "Germany", users: 4150, percentage: 22 },
  { country: "Poland", users: 2890, percentage: 15 },
  { country: "Latvia", users: 1980, percentage: 10 },
  { country: "Estonia", users: 1560, percentage: 8 },
  { country: "Other", users: 3180, percentage: 17 },
];

// KPI data 
const kpiData = [
  {
    title: "Website Visitors",
    value: "25,430",
    change: "+12.5%",
    trend: "up",
    period: "vs. previous month",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Session Duration",
    value: "3m 24s",
    change: "+8.3%",
    trend: "up",
    period: "vs. previous month",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Bounce Rate",
    value: "28.3%",
    change: "-5.2%",
    trend: "up", // Down is good for bounce rate
    period: "vs. previous month",
    icon: <MousePointer className="h-4 w-4" />,
  },
  {
    title: "Conversion Rate",
    value: "3.8%",
    change: "+0.6%",
    trend: "up",
    period: "vs. previous month",
    icon: <TrendingUp className="h-4 w-4" />,
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("90days");
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500">Monitor website traffic and user behavior</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => console.log("Generating report...")}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  kpi.trend === "up" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-red-100 text-red-600"
                }`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 inline mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 inline mr-1" />
                  )}
                  {kpi.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">{kpi.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Visitors, page views, and unique visitors over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                className="h-72"
                data={websiteVisitsData}
                index="date"
                categories={["visits", "pageViews", "uniqueVisitors"]}
                colors={["blue", "cyan", "indigo"]}
                valueFormatter={(number) => number.toString()}
                showLegend
                showGridLines
                showYAxis
                showXAxis
              />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Percentage of visitors that complete a goal</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-60"
                  data={conversionRateData}
                  index="date"
                  categories={["rate"]}
                  colors={["blue"]}
                  valueFormatter={(number) => `${number.toFixed(1)}%`}
                  showLegend={false}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  className="h-60"
                  data={trafficSourcesData}
                  category="value"
                  index="source"
                  colors={["blue", "cyan", "indigo", "violet", "purple"]}
                  valueFormatter={(number) => `${number}%`}
                  showLabel
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources Detailed</CardTitle>
              <CardDescription>Comprehensive breakdown of visitor sources</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-slate-50 py-3 px-4 text-sm font-medium">
                  <div className="col-span-4">Source</div>
                  <div className="col-span-2 text-right">Visitors</div>
                  <div className="col-span-2 text-right">% of Total</div>
                  <div className="col-span-2 text-right">Bounce Rate</div>
                  <div className="col-span-2 text-right">Conversion</div>
                </div>
                
                {[
                  { source: "Google", visitors: 12568, percentage: 35, bounce: 28, conversion: 4.2 },
                  { source: "Direct / None", visitors: 8742, percentage: 24, bounce: 32, conversion: 3.8 },
                  { source: "Facebook", visitors: 3450, percentage: 10, bounce: 42, conversion: 2.7 },
                  { source: "Bing", visitors: 2845, percentage: 8, bounce: 35, conversion: 3.1 },
                  { source: "LinkedIn", visitors: 1965, percentage: 5, bounce: 29, conversion: 4.5 },
                  { source: "Email Campaigns", visitors: 1780, percentage: 5, bounce: 24, conversion: 5.2 },
                  { source: "Twitter", visitors: 1240, percentage: 3, bounce: 44, conversion: 2.1 },
                  { source: "Instagram", visitors: 980, percentage: 3, bounce: 38, conversion: 2.9 },
                  { source: "Referral", visitors: 2560, percentage: 7, bounce: 26, conversion: 4.8 },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-12 py-3 px-4 text-sm ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}>
                    <div className="col-span-4 font-medium">{row.source}</div>
                    <div className="col-span-2 text-right">{row.visitors.toLocaleString()}</div>
                    <div className="col-span-2 text-right">{row.percentage}%</div>
                    <div className="col-span-2 text-right">{row.bounce}%</div>
                    <div className="col-span-2 text-right">{row.conversion}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Referral Traffic</CardTitle>
                <CardDescription>Top websites sending visitors to you</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-slate-50 py-2 px-3 text-xs font-medium">
                    <div className="col-span-6">Website</div>
                    <div className="col-span-3 text-right">Visitors</div>
                    <div className="col-span-3 text-right">Conversion</div>
                  </div>
                  
                  {[
                    { site: "trucking-forum.eu", visitors: 845, conversion: 3.8 },
                    { site: "auto-transport.de", visitors: 612, conversion: 4.2 },
                    { site: "logistics-news.com", visitors: 523, conversion: 2.9 },
                    { site: "transport-review.lt", visitors: 487, conversion: 5.1 },
                    { site: "car-shipping-rates.com", visitors: 342, conversion: 3.5 },
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-12 py-2 px-3 text-xs ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}>
                      <div className="col-span-6 font-medium">{row.site}</div>
                      <div className="col-span-3 text-right">{row.visitors}</div>
                      <div className="col-span-3 text-right">{row.conversion}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Results from your marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-slate-50 py-2 px-3 text-xs font-medium">
                    <div className="col-span-5">Campaign</div>
                    <div className="col-span-2 text-right">Visits</div>
                    <div className="col-span-2 text-right">Leads</div>
                    <div className="col-span-3 text-right">Conversion</div>
                  </div>
                  
                  {[
                    { name: "Spring Promo 2023", visits: 3450, leads: 143, conversion: 4.1 },
                    { name: "German Market", visits: 2380, leads: 112, conversion: 4.7 },
                    { name: "Luxury Transport", visits: 1860, leads: 97, conversion: 5.2 },
                    { name: "Easter Newsletter", visits: 1240, leads: 56, conversion: 4.5 },
                    { name: "Retargeting Ads", visits: 980, leads: 42, conversion: 4.3 },
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-12 py-2 px-3 text-xs ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}>
                      <div className="col-span-5 font-medium">{row.name}</div>
                      <div className="col-span-2 text-right">{row.visits}</div>
                      <div className="col-span-2 text-right">{row.leads}</div>
                      <div className="col-span-3 text-right">{row.conversion}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Pages</CardTitle>
                <CardDescription>Most viewed pages on your website</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-slate-50 py-3 px-4 text-sm font-medium">
                    <div className="col-span-6">Page</div>
                    <div className="col-span-3 text-right">Views</div>
                    <div className="col-span-3 text-right">Avg. Time</div>
                  </div>
                  
                  {popularPagesData.map((page, i) => (
                    <div key={i} className={`grid grid-cols-12 py-3 px-4 text-sm ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}>
                      <div className="col-span-6 font-medium">{page.page}</div>
                      <div className="col-span-3 text-right">{page.views.toLocaleString()}</div>
                      <div className="col-span-3 text-right">{page.avgTime}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>What devices visitors are using</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  className="h-60"
                  data={deviceData}
                  category="percentage"
                  index="device"
                  colors={["blue", "cyan", "indigo"]}
                  valueFormatter={(number) => `${number}%`}
                  showLabel
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Flow</CardTitle>
              <CardDescription>How visitors navigate through your website</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-slate-50 rounded-md">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">User Flow Visualization</h3>
                <p className="text-slate-500 max-w-md">
                  This area would display an interactive diagram showing how users navigate between pages on your website.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Where your visitors are located</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-slate-50 py-3 px-4 text-sm font-medium">
                    <div className="col-span-4">Country</div>
                    <div className="col-span-4 text-right">Users</div>
                    <div className="col-span-4 text-right">Percentage</div>
                  </div>
                  
                  {demographicsData.map((country, i) => (
                    <div key={i} className={`grid grid-cols-12 py-3 px-4 text-sm ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}>
                      <div className="col-span-4 font-medium">{country.country}</div>
                      <div className="col-span-4 text-right">{country.users.toLocaleString()}</div>
                      <div className="col-span-4 text-right">{country.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>Browser languages of your visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-60"
                  data={[
                    { language: "Lithuanian", percentage: 32 },
                    { language: "German", percentage: 24 },
                    { language: "English", percentage: 18 },
                    { language: "Polish", percentage: 12 },
                    { language: "Russian", percentage: 8 },
                    { language: "Other", percentage: 6 },
                  ]}
                  index="language"
                  categories={["percentage"]}
                  colors={["blue"]}
                  valueFormatter={(number) => `${number}%`}
                  layout="vertical"
                  showLegend={false}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Demographic Insights</CardTitle>
              <CardDescription>Age and gender distribution of your visitors</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-3">Age Distribution</h3>
                  <BarChart
                    className="h-48"
                    data={[
                      { age: "18-24", percentage: 8 },
                      { age: "25-34", percentage: 32 },
                      { age: "35-44", percentage: 28 },
                      { age: "45-54", percentage: 18 },
                      { age: "55-64", percentage: 10 },
                      { age: "65+", percentage: 4 },
                    ]}
                    index="age"
                    categories={["percentage"]}
                    colors={["blue"]}
                    valueFormatter={(number) => `${number}%`}
                    showLegend={false}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Gender Distribution</h3>
                  <DonutChart
                    className="h-48"
                    data={[
                      { gender: "Male", percentage: 68 },
                      { gender: "Female", percentage: 30 },
                      { gender: "Other", percentage: 2 },
                    ]}
                    category="percentage"
                    index="gender"
                    colors={["blue", "cyan", "indigo"]}
                    valueFormatter={(number) => `${number}%`}
                    showLabel
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
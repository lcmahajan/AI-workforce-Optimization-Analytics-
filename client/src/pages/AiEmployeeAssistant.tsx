import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, ChevronRight, RefreshCw, Download, Send, Bot, User as UserIcon,
  TrendingUp, Users, Clock, Zap, BookOpen, AlertTriangle, CheckCircle, 
  BarChart3, FileText, Mail, Calendar, DollarSign, Target, Activity
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  mockEmployees, 
  EmployeeData, 
  searchEmployees, 
  filterByDepartment, 
  filterByRole,
  getFitmentClassification,
  calculateFTEOptimization,
  calculateAutomationSavings,
  filterEmployeeDataByRole
} from "@/data/mockEmployeeData";

type Role = "Admin" | "Manager" | "Editor";

interface ChatMessage {
  role: "system" | "assistant" | "user";
  content: string;
  timestamp: Date;
}

// Mock AI response generator
function generateAIResponse(employee: EmployeeData, query?: string): string {
  if (query) {
    // Handle specific queries
    if (query.toLowerCase().includes("train to fit")) {
      return `${employee.name} has a fitment score of ${employee.fitmentScore}, which classifies them as "${getFitmentClassification(employee.fitmentScore)}". This indicates a skills gap that can be bridged through targeted training in areas like ${employee.skills.hard.length > 2 ? employee.skills.hard.slice(-2).join(" and ") : "advanced technical skills"}.`;
    }
    if (query.toLowerCase().includes("training")) {
      const automation = calculateAutomationSavings(employee);
      return `Recommended trainings for ${employee.name}:\n1. RPA Basics & Automation Tools (addressing ${automation[0]?.processName || "repetitive processes"})\n2. Advanced ${employee.skills.hard[0]} Certification\n3. ${employee.skills.soft.length < 4 ? "Leadership & Communication Skills" : "Strategic Planning Workshop"}`;
    }
    if (query.toLowerCase().includes("productivity") || query.toLowerCase().includes("6 months")) {
      const avg = employee.productivityHistory.reduce((s, h) => s + h.value, 0) / employee.productivityHistory.length;
      return `${employee.name}'s productivity over the last 6 months:\n${employee.productivityHistory.map(h => `${h.month}: ${h.value}%`).join("\n")}\n\nAverage: ${avg.toFixed(1)}% - ${avg >= 80 ? "performing well" : "needs improvement"}`;
    }
    if (query.toLowerCase().includes("automate")) {
      const automation = calculateAutomationSavings(employee);
      return `Top processes to automate for ${employee.name}:\n${automation.map((a, i) => `${i + 1}. ${a.processName} (potential FTE savings: ${a.fteSavings.toFixed(2)})`).join("\n")}`;
    }
  }
  
  // Default comprehensive summary
  const fitment = getFitmentClassification(employee.fitmentScore);
  const fteOpt = calculateFTEOptimization(employee);
  const automation = calculateAutomationSavings(employee);
  
  return `**Profile Summary**\n${employee.name} (${employee.userid}), ${employee.position} in ${employee.department}, joined ${new Date(employee.joiningDate).getFullYear()} (${employee.experienceYears} yrs). Top skills: ${employee.skills.hard.slice(0, 3).join(", ")}. Fitment Score: ${employee.fitmentScore} — **${fitment}**${fitment === "Train to Fit" ? " (gap in automation scripting)" : ""}.\n\n**Performance**\nProductivity: ${employee.productivity}% average; Utilization: ${employee.utilization}%. Major processes: ${employee.processes.slice(0, 2).map(p => `${p.name} (${Math.round(p.hours/160*100)}% time)`).join(", ")}.\n\n**FTE Optimization / Automation Potential**\nAutomation Potential: ${employee.automationPotential >= 70 ? "High" : employee.automationPotential >= 40 ? "Medium" : "Low"} for ${automation[0]?.processName || "current processes"} — repetitive steps + high time share. Estimate: save ${automation[0]?.fteSavings.toFixed(2) || "0.5"} FTE if automated.\n\n**Recommendations**\n${employee.productivity < 70 ? "- Short-term: Enroll in skill development programs\n" : ""}${automation.length > 0 ? `- Medium-term: Pair with automation specialist to document ${automation[0].processName} for RPA\n` : ""}${fitment === "Train to Fit" ? "- HR Action: Consider 'Train to Fit' targeted program; monitor 3 months post-training" : fitment === "Fit" || fitment === "Overfit" ? "- HR Action: Ready for increased responsibilities or promotion consideration" : "- HR Action: Performance improvement plan recommended"}`;
}

export default function AiEmployeeAssistant() {
  const [currentRole, setCurrentRole] = useState<Role>("Manager");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    let results = searchEmployees(searchQuery, mockEmployees);
    if (departmentFilter !== "all") {
      results = filterByDepartment(departmentFilter, results);
    }
    if (roleFilter !== "all") {
      results = filterByRole(roleFilter, results);
    }
    return results.slice(0, 5);
  }, [searchQuery, departmentFilter, roleFilter]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Load employee and generate AI summary
  const loadEmployee = (employee: EmployeeData) => {
    // DEMO: Filter employee data based on current role
    // PRODUCTION: Replace with API call like:
    //   const response = await fetch(`/api/employees/${employee.userid}?role=${currentRole}`);
    //   const filteredEmployee = await response.json();
    // Server should filter data based on authenticated user's role
    const filteredEmployee = filterEmployeeDataByRole(employee, currentRole);
    setSelectedEmployee(filteredEmployee);
    setShowSearchResults(false);
    setSearchQuery(employee.name);
    
    // Generate AI summary
    const aiSummary = generateAIResponse(filteredEmployee);
    setChatMessages([
      {
        role: "system",
        content: `Analyzing employee ${filteredEmployee.name} (${filteredEmployee.userid})...`,
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: aiSummary,
        timestamp: new Date(),
      },
    ]);
  };

  // Refresh insights
  const refreshInsights = () => {
    if (!selectedEmployee) return;
    const aiSummary = generateAIResponse(selectedEmployee);
    setChatMessages(prev => [
      ...prev,
      {
        role: "system",
        content: "Refreshing analysis...",
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: aiSummary,
        timestamp: new Date(),
      },
    ]);
  };

  // Send user query
  const sendQuery = (query?: string) => {
    if (!selectedEmployee) return;
    const queryText = query || userInput.trim();
    if (!queryText) return;

    setChatMessages(prev => [
      ...prev,
      {
        role: "user",
        content: queryText,
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: generateAIResponse(selectedEmployee, queryText),
        timestamp: new Date(),
      },
    ]);
    setUserInput("");
  };

  // Quick query buttons
  const quickQueries = [
    "Why is this employee Train to Fit?",
    "List 3 recommended trainings",
    "Show last 6 months productivity",
    "Which processes to automate for this employee?",
  ];

  // RBAC: Check field visibility
  // Note: In production, use server-side filtering instead of client-side checks
  const canViewField = (field: "salary" | "email" | "sensitive"): boolean => {
    if (currentRole === "Admin") return true;
    if (currentRole === "Manager" && field === "email") return true;
    return false;
  };
  
  // Re-filter employee data when role changes (RBAC demo)
  // PRODUCTION: When role changes, re-fetch from server with new role parameter
  useEffect(() => {
    if (selectedEmployee) {
      // DEMO: Find original employee data from mock array
      const originalEmployee = mockEmployees.find(emp => emp.userid === selectedEmployee.userid);
      if (originalEmployee) {
        // PRODUCTION: Replace with API call
        const filteredEmployee = filterEmployeeDataByRole(originalEmployee, currentRole);
        setSelectedEmployee(filteredEmployee);
      }
    }
  }, [currentRole]);

  // Get fitment badge color
  const getFitmentColor = (score: number) => {
    if (score >= 9) return "bg-blue-500";
    if (score >= 8) return "bg-green-500";
    if (score >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Chart colors
  const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Optimization</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">AI Assistant — Employee Insights</span>
        </div>
        
        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Demo Role:</span>
          <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as Role)}>
            <SelectTrigger className="w-32" data-testid="select-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" data-testid="badge-current-role">{currentRole}</Badge>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search employee by name or userID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="pl-10"
                data-testid="input-search-employee"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <Card className="absolute top-full mt-1 w-full z-50 max-h-64 overflow-auto" data-testid="dropdown-search-results">
                  <CardContent className="p-2">
                    {searchResults.map((emp) => (
                      <button
                        key={emp.userid}
                        onClick={() => loadEmployee(emp)}
                        className="w-full text-left p-2 hover-elevate rounded-md transition-colors"
                        data-testid={`result-${emp.userid}`}
                      >
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {emp.userid} • {emp.position} • {emp.department}
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40" data-testid="select-department">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40" data-testid="select-role-filter">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="specialist">Specialist</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
            
            {selectedEmployee && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshInsights}
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {!selectedEmployee ? (
        <Card className="flex-1 flex items-center justify-center">
          <CardContent className="text-center p-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Employee Selected</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Search for an employee by name or user ID to view their complete profile and get AI-powered insights and recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 overflow-hidden">
          {/* Left Column - Employee Details (60%) */}
          <div className="lg:col-span-3 overflow-auto space-y-4">
            {/* Employee Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {selectedEmployee.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold" data-testid="text-employee-name">{selectedEmployee.name}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" data-testid="text-userid">{selectedEmployee.userid}</Badge>
                        <span className="text-sm text-muted-foreground">{selectedEmployee.position}</span>
                        <span className="text-sm">•</span>
                        <span className="text-sm text-muted-foreground">{selectedEmployee.department}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {selectedEmployee.email ? (
                          <span className="text-muted-foreground" data-testid="text-email">{selectedEmployee.email}</span>
                        ) : (
                          <Badge variant="secondary" data-testid="badge-email-restricted">Restricted</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Joined {new Date(selectedEmployee.joiningDate).getFullYear()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{selectedEmployee.experienceYears} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {selectedEmployee.salary > 0 ? (
                          <span className="text-muted-foreground font-medium" data-testid="text-salary">${selectedEmployee.salary.toLocaleString()}</span>
                        ) : (
                          <Badge variant="secondary" data-testid="badge-salary-restricted">Restricted</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Fitment Score</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold" data-testid="text-fitment-score">{selectedEmployee.fitmentScore}</div>
                      <Badge className={getFitmentColor(selectedEmployee.fitmentScore)} data-testid="badge-fitment">
                        {getFitmentClassification(selectedEmployee.fitmentScore)}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Productivity</div>
                    <div className="text-2xl font-bold" data-testid="text-productivity">{selectedEmployee.productivity}%</div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Utilization</div>
                    <div className="text-2xl font-bold" data-testid="text-utilization">{selectedEmployee.utilization}%</div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Automation Potential</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{selectedEmployee.automationPotential}</div>
                      <Badge variant={selectedEmployee.automationPotential >= 70 ? "destructive" : "secondary"}>
                        {selectedEmployee.automationPotential >= 70 ? "High" : selectedEmployee.automationPotential >= 40 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Additional Metrics */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline">
                    <Target className="h-3 w-3 mr-1" />
                    Skill Score: {selectedEmployee.skillScore}
                  </Badge>
                  <Badge variant="outline">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Aptitude: {selectedEmployee.aptitudeScore}
                  </Badge>
                  <Badge variant="outline">
                    <Activity className="h-3 w-3 mr-1" />
                    FTE: {calculateFTEOptimization(selectedEmployee).toFixed(2)}
                  </Badge>
                  <Badge variant={selectedEmployee.consolidated ? "default" : "secondary"}>
                    {selectedEmployee.consolidated ? "Consolidated" : "Non-Consolidated"}
                  </Badge>
                  <Badge variant="outline">
                    C: {selectedEmployee.consolidatedCount} / NC: {selectedEmployee.nonConsolidatedCount}
                  </Badge>
                  {selectedEmployee.fatigueScore > 60 && (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      High Fatigue ({selectedEmployee.fatigueScore})
                    </Badge>
                  )}
                </div>
                
                {/* Tags */}
                {selectedEmployee.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedEmployee.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Role Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Current Role</div>
                    <div className="font-medium">{selectedEmployee.currentRole}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Recommended Role</div>
                    <div className="font-medium text-green-600 dark:text-green-400">{selectedEmployee.recommendedRole}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="activities" data-testid="tab-activities">Activities</TabsTrigger>
                <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
                <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
                <TabsTrigger value="documents" data-testid="tab-documents">Documents</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Productivity Trend (Last 6 Months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={selectedEmployee.productivityHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Work Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Consolidated", value: selectedEmployee.consolidatedCount },
                            { name: "Non-Consolidated", value: selectedEmployee.nonConsolidatedCount },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Activities Tab */}
              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Processes Worked On</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedEmployee.processes.map((process, idx) => (
                        <div key={idx} className="p-3 rounded-md bg-muted/50 space-y-2" data-testid={`process-${idx}`}>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{process.name}</div>
                            {process.repetitiveScore >= 70 && (
                              <Badge variant="destructive" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                Automation Candidate
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Time: </span>
                              <span className="font-medium">{process.hours}h/month</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Output: </span>
                              <span className="font-medium">{process.output}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Repetitive: </span>
                              <span className="font-medium">{process.repetitiveScore}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Skill Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={[
                          { name: "Hard Skills", score: selectedEmployee.skillScore },
                          { name: "Soft Skills", score: selectedEmployee.aptitudeScore },
                          { name: "Overall", score: (selectedEmployee.skillScore + selectedEmployee.aptitudeScore) / 2 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Hard Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployee.skills.hard.map((skill) => (
                          <Badge key={skill} variant="default">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Soft Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployee.skills.soft.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Skill Gaps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Identified Skill Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEmployee.fitmentScore < 8 && (
                        <div className="text-sm">
                          • Advanced automation and RPA skills needed for role optimization
                        </div>
                      )}
                      {selectedEmployee.skills.soft.length < 4 && (
                        <div className="text-sm">
                          • Leadership and communication skills for career advancement
                        </div>
                      )}
                      {selectedEmployee.automationPotential > 70 && (
                        <div className="text-sm">
                          • Process optimization and efficiency management training recommended
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedEmployee.productivityHistory.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="text-sm font-medium w-12">{entry.month}</div>
                          <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                            <div
                              className={`h-full ${
                                entry.value >= 80 ? "bg-green-500" : entry.value >= 60 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${entry.value}%` }}
                            />
                          </div>
                          <div className="text-sm font-medium w-12 text-right">{entry.value}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Average Productivity</div>
                        <div className="text-2xl font-bold">
                          {(selectedEmployee.productivityHistory.reduce((s, h) => s + h.value, 0) / selectedEmployee.productivityHistory.length).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Trend</div>
                        <div className="flex items-center gap-2">
                          {selectedEmployee.productivityHistory[selectedEmployee.productivityHistory.length - 1].value >
                          selectedEmployee.productivityHistory[0].value ? (
                            <TrendingUp className="h-6 w-6 text-green-500" />
                          ) : (
                            <TrendingUp className="h-6 w-6 text-red-500 transform rotate-180" />
                          )}
                          <span className="text-sm font-medium">
                            {selectedEmployee.productivityHistory[selectedEmployee.productivityHistory.length - 1].value >
                            selectedEmployee.productivityHistory[0].value
                              ? "Improving"
                              : "Declining"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Employee Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEmployee.documents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p>No documents available</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedEmployee.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover-elevate"
                            data-testid={`document-${idx}`}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-sm">{doc.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {doc.type} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - AI Assistant (40%) */}
          <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
            {/* Quick Facts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{selectedEmployee.experienceYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fitment:</span>
                  <Badge className={getFitmentColor(selectedEmployee.fitmentScore)}>
                    {getFitmentClassification(selectedEmployee.fitmentScore)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Skill:</span>
                  <span className="font-medium">{selectedEmployee.skills.hard[0]}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Chat */}
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-500" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-3" data-testid="chat-messages">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                      data-testid={`message-${idx}`}
                    >
                      {msg.role !== "user" && (
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.role === "system" ? "bg-muted" : "bg-blue-500"
                        }`}>
                          {msg.role === "system" ? (
                            <Activity className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-lg p-3 text-sm ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white"
                            : msg.role === "system"
                            ? "bg-muted text-muted-foreground text-xs italic"
                            : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                      {msg.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Queries */}
                <div className="p-3 border-t space-y-2">
                  <div className="text-xs text-muted-foreground mb-2">Quick Queries:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQueries.map((query, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        onClick={() => sendQuery(query)}
                        className="text-xs h-auto py-2 px-2 whitespace-normal text-left justify-start"
                        data-testid={`quick-query-${idx}`}
                      >
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Ask about this employee..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendQuery()}
                      className="flex-1"
                      data-testid="input-chat"
                    />
                    <Button onClick={() => sendQuery()} data-testid="button-send">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {calculateAutomationSavings(selectedEmployee).length > 0 && (
                  <Button size="sm" variant="outline" className="w-full justify-start" data-testid="action-automation">
                    <Zap className="h-4 w-4 mr-2" />
                    Flag for Automation Review
                  </Button>
                )}
                {selectedEmployee.fitmentScore < 8 && (
                  <Button size="sm" variant="outline" className="w-full justify-start" data-testid="action-training">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add Training Plan
                  </Button>
                )}
                <Button size="sm" variant="outline" className="w-full justify-start" data-testid="action-meeting">
                  <Users className="h-4 w-4 mr-2" />
                  Schedule 1:1 Meeting
                </Button>
                {canViewField("sensitive") && (
                  <Button size="sm" variant="outline" className="w-full justify-start" data-testid="action-export">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report (PDF)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Suggested Trainings */}
            {selectedEmployee.fitmentScore < 8 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    Suggested Trainings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {calculateAutomationSavings(selectedEmployee).length > 0 && (
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="font-medium">RPA Basics & Automation Tools</div>
                      <div className="text-xs text-muted-foreground">Duration: 2 weeks • Priority: High</div>
                    </div>
                  )}
                  <div className="p-2 rounded-md bg-muted/50">
                    <div className="font-medium">Advanced {selectedEmployee.skills.hard[0]}</div>
                    <div className="text-xs text-muted-foreground">Duration: 1 month • Priority: Medium</div>
                  </div>
                  {selectedEmployee.skills.soft.length < 4 && (
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="font-medium">Leadership & Communication Skills</div>
                      <div className="text-xs text-muted-foreground">Duration: 3 weeks • Priority: Medium</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

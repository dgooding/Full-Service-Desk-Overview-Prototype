
export interface ExecutiveRep {
  repId: string;
  fullName: string;
  team: 'Alpha' | 'Bravo' | 'Charlie' | 'Delta' | 'Echo';
  supervisor: string;
  shift: 'Morning' | 'Afternoon' | 'Evening';
  location: 'Colorado Springs, CO' | 'Tampa, FL' | 'Austin, TX' | 'Remote';
  hireDate: string;
  ticketsResolved_MTD: number;
  callsHandled_MTD: number;
  avgHandleTime_min: number;
  firstCallResolution_pct: number;
  customerSat_pct: number;
  qualityScore: number;
  adherence_pct: number;
  slaCompliance_pct: number;
  backlogTickets: number;
  escalationRate_pct: number;
  coachingSessions_completed: number;
  overallPerformanceScore: number;
  performanceTier: '🟢 Elite' | '🔵 Strong' | '🟡 Developing' | '🔴 Needs Support';
}

const supervisors = [
  'Emma Rodriguez', 'James Wilson', 'Sia Miller', 'Robert Chen', 'Elena Vasquez',
  'David Thompson', 'Sarah Jenkins', 'Michael Okoro', 'Jennifer Lopez', 'William Brown'
];

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

export const generateExecutiveData = (): ExecutiveRep[] => {
  const reps: ExecutiveRep[] = [];

  for (let i = 1; i <= 100; i++) {
    const repId = `REP-${i.toString().padStart(3, '0')}`;
    const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const teams: ExecutiveRep['team'][] = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
    const shifts: ExecutiveRep['shift'][] = ['Morning', 'Afternoon', 'Evening'];
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    const locations: ExecutiveRep['location'][] = ['Colorado Springs, CO', 'Tampa, FL', 'Austin, TX', 'Remote'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const hireDate = new Date(2019 + Math.floor(Math.random() * 7), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
    
    const ticketsResolved_MTD = 40 + Math.floor(Math.random() * 281);
    const callsHandled_MTD = 80 + Math.floor(Math.random() * 521);
    const avgHandleTime_min = parseFloat((4 + Math.random() * 14).toFixed(1));
    const firstCallResolution_pct = parseFloat((55 + Math.random() * 44).toFixed(1));
    const customerSat_pct = parseFloat((60 + Math.random() * 40).toFixed(1));
    const qualityScore = parseFloat((70 + Math.random() * 30).toFixed(1));
    const adherence_pct = parseFloat((75 + Math.random() * 25).toFixed(1));
    const slaCompliance_pct = parseFloat((80 + Math.random() * 20).toFixed(1));
    const backlogTickets = Math.floor(Math.random() * 20);
    const escalationRate_pct = parseFloat((5 + Math.random() * 25).toFixed(1));
    const coachingSessions_completed = Math.floor(Math.random() * 9);

    // Calc overallPerformanceScore
    // Normalize tickets (40-320 range)
    const normalizedTickets = ((ticketsResolved_MTD - 40) / (320 - 40)) * 100;
    const overallPerformanceScore = parseFloat((
      (firstCallResolution_pct * 0.20) +
      (customerSat_pct * 0.20) +
      (qualityScore * 0.20) +
      (slaCompliance_pct * 0.20) +
      (adherence_pct * 0.10) +
      (normalizedTickets * 0.10)
    ).toFixed(1));

    let performanceTier: ExecutiveRep['performanceTier'] = '🔴 Needs Support';
    if (overallPerformanceScore >= 90) performanceTier = '🟢 Elite';
    else if (overallPerformanceScore >= 80) performanceTier = '🔵 Strong';
    else if (overallPerformanceScore >= 70) performanceTier = '🟡 Developing';

    reps.push({
      repId, fullName, team, supervisor, shift, location, hireDate,
      ticketsResolved_MTD, callsHandled_MTD, avgHandleTime_min,
      firstCallResolution_pct, customerSat_pct, qualityScore,
      adherence_pct, slaCompliance_pct, backlogTickets, escalationRate_pct, coachingSessions_completed,
      overallPerformanceScore, performanceTier
    });
  }

  return reps.sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore);
};

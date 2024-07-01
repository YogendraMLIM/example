import React from 'react'
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Attendance = React.lazy(() => import('../views/attendance/Attendance'))
const Leave = React.lazy(() => import('../views/leave/LeavePage'))
const OfficialDutyWFH = React.lazy(() => import('../views/od-wfh/OfficialDuty')) 

const supperadmin = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/attendance', name: 'Attendance', element: Attendance },
  { path: '/leave', name: 'Leave', element: Leave },
  { path: '/od-wfh', name: 'Official Duty / WFH', element: OfficialDutyWFH },
];
export default supperadmin

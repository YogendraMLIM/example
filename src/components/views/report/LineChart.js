import React, { useEffect, useState } from 'react';
import Config from "../../../Config";
import { useSelector } from "react-redux";
import { CChartLine } from '@coreui/react-chartjs';
import axios from 'axios';

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CFormInput,
} from '@coreui/react';

const LineChart = () => {
    const user = useSelector((state) => state.user);
    const [empIds, setEmpIds] = useState([]);
    const [empNames, setEmpNames] = useState([]);
    const [workingHours, setWorkingHours] = useState([]);
    const [empHours, setEmpHours] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const convertTimeToHours = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours + minutes / 60 + seconds / 3600;
    };

    const yesterdayDate = () => {
        const today = new Date();
        let dayOfWeek = today.getDay();

        // If today is Monday, set the date to last Friday
        if (dayOfWeek === 1) {
            today.setDate(today.getDate() - 3);
        }
        // If today is Sunday, set the date to last Friday
        else if (dayOfWeek === 0) {
            today.setDate(today.getDate() - 2);
        }
        // If today is Saturday, set the date to last Friday
        else if (dayOfWeek === 6) {
            today.setDate(today.getDate() - 1);
        }
        // For other days, simply go back one day
        else {
            today.setDate(today.getDate() - 1);
        }

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
        const day = String(today.getDate()).padStart(2, '0');

        setSelectedDate(`${year}-${month}-${day}`);
    }

    useEffect(() => {
        const fetchEmployeeLeaves = async () => {
            const response = await axios.get(`${Config.apiUrl}/workingHours?date=${selectedDate}`);
            setEmpHours(response.data.data);
        };

        fetchEmployeeLeaves();
    }, [selectedDate]);

    useEffect(() => {
        const extractedEmpIds = empHours.map(obj => obj.EmpID);
        const extractedEmpNames = empHours.map(obj => obj.fullName);
        const extractedworkingHours = empHours.map(obj => obj.workedFor);

        setEmpIds(extractedEmpIds);
        setEmpNames(extractedEmpNames);
        setWorkingHours(extractedworkingHours);
    }, [empHours]);

    useEffect(() => {
        yesterdayDate();
    }, []);

    const numericData = workingHours.map(convertTimeToHours);

    const chartData = {
        data: {
            labels: empNames,
            datasets: [
                {
                    barPercentage: 0.8,
                    label: 'Working Hours',
                    backgroundColor: ['rgba(90, 209, 255, 1)'],
                    borderColor: 'rgba(6, 27, 94, 1)',
                    borderWidth: 1,
                    data: numericData,
                },
            ],
        },
        labels: "Employee",
        options: {
            indexAxis: 'x',
        }
    }

    return (
        <div>
            <CRow xs={{ gutter: 3 }}>
                <CCol>
                    <CCard style={{ marginBottom: '50px' }}>
                        <CCardHeader>
                            <CRow>
                                <CCol className='mb-1' xs={12} sm={6} md={6} xl={6}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <p>Employee Working Hours</p>
                                        <CFormInput style={{ marginLeft: '20px', maxWidth: '150px' }}
                                            type="date"
                                            id="date-input"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody style={{ maxHeight: '26rem' }}>
                            <CChartLine
                                style={{ maxHeight: '25rem' }}
                                data={chartData.data}
                                options={chartData.options}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export default LineChart;

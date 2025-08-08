import React from 'react';
import {
    FaMugHot,
    FaShower,
    FaTshirt,
    FaUtensils,
    FaSnowflake,
    FaLock,
    FaConciergeBell,
    FaWifi,
    FaTv,
    FaMapMarkedAlt,
    FaWind,
    FaTools,
} from 'react-icons/fa';

const facilities = [
    { icon: <FaMugHot size={32} />, label: 'Tea & Coffee' },
    { icon: <FaShower size={32} />, label: 'Hot Showers' },
    { icon: <FaTshirt size={32} />, label: 'Laundry' },
    { icon: <FaUtensils size={32} />, label: 'Kitchen' },
    { icon: <FaSnowflake size={32} />, label: 'Air Conditioner' },
    { icon: <FaLock size={32} />, label: 'Lockers' },
    { icon: <FaConciergeBell size={32} />, label: '24/7 Reception' },
    { icon: <FaWifi size={32} />, label: 'Free Wi-Fi' },
    { icon: <FaTv size={32} />, label: 'TV' },
    { icon: <FaMapMarkedAlt size={32} />, label: 'City Map' },
    { icon: <FaWind size={32} />, label: 'Hairdryer' },
    { icon: <FaTools size={32} />, label: 'Iron' },
];

const Facilities = () => {
    return (
        <div className="py-16 px-4 text-center">
            <h2 className="text-5xl font-bold text-orange-500 italic mb-4">Facilities</h2>
            <p className="uppercase text-gray-600 tracking-widest mb-12">What we offer for free</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 max-w-6xl mx-auto">
                {facilities.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-2">
                        <div className="bg-yellow-300 rounded-full p-6 shadow-md">
                            {item.icon}
                        </div>
                        <p className="font-semibold text-gray-800 text-sm uppercase">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Facilities;
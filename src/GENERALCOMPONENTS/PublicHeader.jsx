import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { useBranch } from '../CONTEXTS/BranchContext';

const PublicHeader = () => {
    const [showBranches, setShowBranches] = useState(false);
    const { selectedBranch, setSelectedBranch, branches } = useBranch();
    const navigate = useNavigate();

    const toggleBranchesMenu = () => setShowBranches(!showBranches);

    const handleBranchSelect = (branch) => {
        setSelectedBranch(branch.nameBranch);
        setShowBranches(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 flex flex-col md:flex-row items-center justify-between p-4 bg-red-600 text-white shadow-lg space-y-2 md:space-y-0 z-50">
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-xl md:text-2xl font-semibold hover:text-yellow-300 transition-colors">
                    Sistema de Administración
                </Link>
                <div className="relative">
                    <button onClick={toggleBranchesMenu} className="ml-2 md:ml-4 flex items-center space-x-1">
                        <span className="text-sm md:text-base">{selectedBranch || "Seleccionar Sucursal"}</span>
                        <FaChevronDown className="text-xl md:text-2xl hover:text-yellow-300 transition-colors" />
                    </button>
                    {showBranches && (
                        <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                            {branches.length > 0 ? (
                                <ul className="max-h-48 overflow-y-auto custom-scrollbar">
                                    {branches.map((branch) => (
                                        <li
                                            key={branch._id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                            onClick={() => handleBranchSelect(branch)}
                                        >
                                            {branch.nameBranch}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="px-4 py-2 text-gray-500">No hay sucursales disponibles</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-red-600 py-1 px-3 rounded-full shadow-md hover:bg-gray-100 transition-colors w-full md:w-auto"
                >
                    Log In
                </button>
                <button
                    onClick={() => navigate('/registro')} 
                    className="bg-white text-red-600 py-1 px-3 rounded-full shadow-md hover:bg-gray-100 transition-colors w-full md:w-auto"
                >
                    Register
                </button>
            </div>
        </header>
    );
};

export default PublicHeader;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBranchsRequest } from '../api/branch';

interface Branch {
  _id: string;
  branchName: string;
}

interface BranchContextType {
  selectedBranch: Branch | null;
  setSelectedBranch: React.Dispatch<React.SetStateAction<Branch | null>>;
  branches: Branch[];
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const storedBranch = localStorage.getItem('selectedBranch');
    if (storedBranch) {
      console.log('Stored Branch:', JSON.parse(storedBranch));
      setSelectedBranch(JSON.parse(storedBranch));
    }
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      console.log('Saving Branch:', selectedBranch);
      localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch));
    }
  }, [selectedBranch]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranchsRequest();
        setBranches(response.data);
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      }
    };

    fetchBranches();
  }, []);

  return (
    <BranchContext.Provider value={{ selectedBranch, setSelectedBranch, branches }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch debe estar dentro de un BranchProvider");
  }
  return context;
};

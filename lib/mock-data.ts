/**
 * Dados Mock para Demonstração
 * 
 * Use estes dados para testar a interface sem configurar backends
 */

export const MOCK_VEHICLES = [
  {
    roNumber: 'DEMO001',
    password: 'demo123',
    vin: '1HGBH41JXMN109186',
    clientName: 'John Smith',
    vehicle: '2020 Honda Civic EX 4D Sedan 2.0L Gasoline (Crystal Black Pearl)',
    insurance: 'PLYMOUTH ROCK ASSURANCE',
    claim: '657002676670',
    model: 'Civic',
    year: '2020',
    make: 'Honda',
    phone: '(978) 123-4567',
  },
  {
    roNumber: 'DEMO002',
    password: 'demo456',
    vin: '5FNRL6H78KB019843',
    clientName: 'Maria Santos',
    vehicle: '2019 Honda Odyssey EX-L 4D Minivan 3.5L V6 (Modern Steel Metallic)',
    insurance: 'GEICO',
    claim: '789012345678',
    model: 'Odyssey',
    year: '2019',
    make: 'Honda',
    phone: '(978) 234-5678',
  },
  {
    roNumber: 'DEMO003',
    password: 'demo789',
    vin: '2HGFC2F59LH543210',
    clientName: 'Peter Johnson',
    vehicle: '2021 Honda Accord Sport 4D Sedan 1.5L Turbo (Platinum White Pearl)',
    insurance: 'STATE FARM',
    claim: '456789012345',
    model: 'Accord',
    year: '2021',
    make: 'Honda',
    phone: '(978) 345-6789',
  },
  {
    roNumber: 'DEMO004',
    password: 'demo101',
    vin: '1FTFW1ET5EFA12345',
    clientName: 'Ana Ferreira',
    vehicle: '2022 Ford F-150 XLT 4WD SuperCrew 5.0L V8 (Oxford White)',
    insurance: 'PROGRESSIVE',
    claim: '321654987012',
    model: 'F-150',
    year: '2022',
    make: 'Ford',
    phone: '(978) 456-7890',
  },
  {
    roNumber: 'DEMO005',
    password: 'demo202',
    vin: '1G1YY22G8P5123456',
    clientName: 'Carlos Mendes',
    vehicle: '2018 Chevrolet Corvette Stingray 2D Coupe 6.2L V8 (Torch Red)',
    insurance: 'ALLSTATE',
    claim: '147258369012',
    model: 'Corvette',
    year: '2018',
    make: 'Chevrolet',
    phone: '(978) 567-8901',
  },
  {
    roNumber: 'DEMO006',
    password: 'demo303',
    vin: '5YJSA1E14FF123456',
    clientName: 'Julia Costa',
    vehicle: '2023 Tesla Model S Long Range AWD Electric (Pearl White Multi-Coat)',
    insurance: 'LIBERTY MUTUAL',
    claim: '963852741012',
    model: 'Model S',
    year: '2023',
    make: 'Tesla',
    phone: '(978) 678-9012',
  },
  {
    roNumber: 'DEMO007',
    password: 'demo404',
    vin: '1C4RJFBG0FC123456',
    clientName: 'Robert Souza',
    vehicle: '2021 Jeep Wrangler Unlimited Sahara 4WD 4D SUV 3.6L V6 (Black)',
    insurance: 'NATIONWIDE',
    claim: '852963741012',
    model: 'Wrangler',
    year: '2021',
    make: 'Jeep',
    phone: '(978) 789-0123',
  },
  {
    roNumber: 'DEMO008',
    password: 'demo505',
    vin: 'WBAJE5C50FCF12345',
    clientName: 'Fernanda Pereira',
    vehicle: '2020 BMW X5 xDrive40i 4D SUV 3.0L Turbo I6 (Alpine White)',
    insurance: 'TRAVELERS',
    claim: '741852963012',
    model: 'X5',
    year: '2020',
    make: 'BMW',
    phone: '(978) 890-1234',
  },
];

export const MOCK_STATUS_DATA = [
  {
    roNumber: 'DEMO001',
    currentStage: 'Vehicle Received',
    message: 'Your vehicle has been received and is currently being inspected by our team. We will conduct a complete damage assessment and contact you soon with details about the repair process.',
    description: 'Initial inspection in progress',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    roNumber: 'DEMO002',
    currentStage: 'Work in Progress',
    message: 'We are actively working on repairing your vehicle. Our team of specialized technicians is following all necessary procedures to ensure the highest quality. We will keep you updated on the progress regularly.',
    description: 'Repair in progress - Body work stage',
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    roNumber: 'DEMO003',
    currentStage: 'Ready for Pickup',
    message: 'Great news! Your vehicle is ready for pickup. All repairs have been completed and the car has passed our rigorous quality inspection. Please contact us to schedule a convenient time for you to pick it up.',
    description: 'Work completed - Awaiting pickup',
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    roNumber: 'DEMO004',
    currentStage: 'Awaiting Approval',
    message: 'We have completed the detailed inspection of your vehicle. We identified all damages and prepared a complete estimate. We are awaiting insurance approval to begin repairs. We will contact you as soon as we receive authorization.',
    description: 'Estimate sent to insurance',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    roNumber: 'DEMO005',
    currentStage: 'Awaiting Parts',
    message: 'Repairs on your vehicle have begun, but we are waiting for some specific parts to arrive. The parts have been ordered and should arrive within the next 3-5 business days. Once received, we will resume work immediately.',
    description: 'Parts ordered - ETA 3-5 days',
    lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    roNumber: 'DEMO006',
    currentStage: 'Paint in Progress',
    message: 'Your vehicle is in the paint stage! Structural repairs have been successfully completed and we are now applying factory-grade paint finish. This process requires proper drying time to ensure a perfect result.',
    description: 'Paint and finishing stage',
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    roNumber: 'DEMO007',
    currentStage: 'Quality Control',
    message: 'Excellent news! Repairs on your vehicle have been completed and it is now going through our rigorous quality control inspection. We check every detail to ensure everything is perfect before returning it to you.',
    description: 'Final quality inspection',
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    roNumber: 'DEMO008',
    currentStage: 'Disassembly & Assessment',
    message: 'We have begun the disassembly process to fully assess the extent of the damage. This step is crucial to identify all necessary repairs, including hidden damage that is not visible externally. We will send you a detailed report soon.',
    description: 'Disassembly for complete assessment',
    lastUpdated: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
  },
];

/**
 * Busca dados mock de um veículo
 * Usa RO + Password (Monday_Item_ID)
 */
export function getMockVehicle(roNumber: string, password: string) {
  const vehicle = MOCK_VEHICLES.find(
    v => v.roNumber.toLowerCase() === roNumber.toLowerCase() &&
         v.password.toLowerCase() === password.toLowerCase()
  );
  
  if (!vehicle) return null;
  
  return {
    ...vehicle,
    mondayItemId: password,
    updates: getMockStatus(roNumber)?.currentStage || 'Vehicle Received',
  };
}

/**
 * Busca status mock de um veículo
 */
export function getMockStatus(roNumber: string) {
  const status = MOCK_STATUS_DATA.find(
    s => s.roNumber.toLowerCase() === roNumber.toLowerCase()
  );
  return status || MOCK_STATUS_DATA[0]; // Default para primeiro status se não encontrar
}

/**
 * Simula envio de mensagem
 */
export function mockSendMessage() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000); // Simula delay de rede
  });
}

/**
 * Verifica se estamos em modo demo
 */
export function isDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
         typeof window !== 'undefined' && window.location.search.includes('demo=true');
}


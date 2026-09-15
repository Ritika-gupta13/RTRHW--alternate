import React, { useState } from 'react';

import WizardHeader from '../components/wizard/WizardHeader';
import Step1FindHouse from '../components/wizard/Step1FindHouse';
import Step2CheckRoof from '../components/wizard/Step2CheckRoof';
import Step3SetupSizing from '../components/wizard/Step3SetupSizing';
import Step4Report from '../components/wizard/Step4Report';

export default function WizardApp({
  onOpenAuth,
  onGoLanding,
  user,
  token,
  onLogout,
  onCalculateSizing
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const [wizardData, setWizardData] = useState({
    roofArea: 145,
    annualRainfall: 950,
    runoffCoeff: 0.85,
    householdMembers: 4,
    soilType: 'Loamy'
  });

  const updateWizardData = (updates) => {
    setWizardData((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const handleReset = () => {
    setCurrentStep(1);

    setWizardData({
      roofArea: 145,
      annualRainfall: 950,
      runoffCoeff: 0.85,
      householdMembers: 4,
      soilType: 'Loamy'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">

      <WizardHeader
        currentStep={currentStep}
        setStep={setCurrentStep}
      />

      <div className="max-w-6xl mx-auto">

        {currentStep === 1 && (
          <Step1FindHouse
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2CheckRoof
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onPrev={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3SetupSizing
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onPrev={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <Step4Report
            wizardData={wizardData}
            token={token}
            onReset={handleReset}
          />
        )}

      </div>
    </div>
  );
}
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

  const defaultWizardData = {
    address: 'Jaipur, Rajasthan',
    mapCenter: [26.9124, 75.7873],
    roofArea: 145,
    polygonPoints: [
      [26.9125, 75.7871],
      [26.9128, 75.7875],
      [26.9126, 75.7878],
      [26.9123, 75.7874]
    ],
    roofMaterial: 'Reinforced Concrete Flat Slab',
    annualRainfall: 950,
    runoffCoeff: 0.85,
    rainfall: 950,
    householdMembers: 4,
    soilType: 'Loamy'
  };

  const [wizardData, setWizardData] = useState(defaultWizardData);

  const updateWizardData = (updates) => {
    setWizardData((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
    setWizardData(defaultWizardData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <WizardHeader currentStep={currentStep} setStep={setCurrentStep} />

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

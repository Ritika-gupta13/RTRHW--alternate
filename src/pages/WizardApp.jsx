import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import WizardHeader from '../components/wizard/WizardHeader';
import Step1FindHouse from '../components/wizard/Step1FindHouse';
import Step2CheckRoof from '../components/wizard/Step2CheckRoof';
import Step3SetupSizing from '../components/wizard/Step3SetupSizing';
import Step4Report from '../components/wizard/Step4Report';

export default function WizardApp({ onOpenAuth, onGoLanding, user, token, onLogout }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Global wizard state
  const [wizardData, setWizardData] = useState({
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
    runoffCoeff: 0.85,
    rainfall: 950,
    householdMembers: 4,
    soilType: 'Loamy'
  });

  const updateWizardData = (newData) => {
    setWizardData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pb-16 pt-28 px-4 sm:px-6">
      {/* Navbar */}
      <Navbar onOpenAuth={onOpenAuth} onStartWizard={onGoLanding} currentView="wizard" user={user} onLogout={onLogout} />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full">
        {/* Step Progress Header */}
        <WizardHeader currentStep={currentStep} setStep={setCurrentStep} />

        {/* Step Content Switcher */}
        {currentStep === 1 && (
          <Step1FindHouse
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2CheckRoof
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {currentStep === 3 && (
          <Step3SetupSizing
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={handleNext}
            onPrev={handlePrev}
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


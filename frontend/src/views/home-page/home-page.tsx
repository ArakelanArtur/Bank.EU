import { HeroSection } from '@/widgets/hero-section/hero-section';
import { CalculatorSection } from '@/widgets/calculator-section/calculator-section';
import { ConditionsSection } from '@/widgets/conditions-section/conditions-section';
import { WhenNeedMoneySection } from '@/widgets/when-need-money-section/when-need-money-section';
import { HowItWorksStepsSection } from '@/widgets/how-it-works-steps-section/how-it-works-steps-section';
import { TransparentSection } from '@/widgets/transparent-section/transparent-section';
import { AboutSection } from '@/widgets/about-section/about-section';
import { CreditHistorySection } from '@/widgets/credit-history-section/credit-history-section';
import { BusinessTeaserSection } from '@/widgets/business-teaser-section/business-teaser-section';
import { TrustSection } from '@/widgets/trust-section/trust-section';
import { FaqPreviewSection } from '@/widgets/faq-preview-section/faq-preview-section';
import { SecuritySection } from '@/widgets/security-section/security-section';
import { ApplicationForm } from '@/widgets/application-form/application-form';
import { FeedbackSection } from '@/widgets/feedback-section/feedback-section';
import { ContactsSection } from '@/widgets/contacts-section/contacts-section';

function Divider() {
  return (
    <div className="mx-auto w-1/2 border-t border-black" />
  );
}

export function HomePageView() {
  return (
    <>
      <HeroSection />
      <CalculatorSection />
      <ConditionsSection />
      <Divider />
      <WhenNeedMoneySection />
      <Divider />
      <HowItWorksStepsSection />
      <Divider />
      <TransparentSection />
      <AboutSection />
      <CreditHistorySection />
      <BusinessTeaserSection />
      <TrustSection />
      <FaqPreviewSection />
      <SecuritySection />
      <ApplicationForm />
      <FeedbackSection />
      <ContactsSection />
    </>
  );
}

import VerticalFeatureRow from '../feature/VerticalFeatureRow';
import Section from '../layout/Section';
import Image1 from "../../../public/undraw1.svg";
import Image2 from "../../../public/undraw0.svg";
import Image3 from "../../../public/undraw2.svg";

const VerticalFeatures = () => (
  <Section
    title="Visualize your data"
    description="Artificial Intelligence Trust Council is buidling a decentralized data analysis tool that helps you regain trust in the information you consume."
  >
    <VerticalFeatureRow
      title="Transparent data"
      description="Trust starts from knowing the source of the information. Clean data that you can see. We use the latest technology to make sure your data is safe and secure."
      image={Image1}
      imageAlt="First feature alt text"
    />
    <VerticalFeatureRow
      title="Polling"
      description="The design of our application allows for easy polling. You can create a poll about pretty much anything and share it with your friends and family.  "
      image={Image2}
      imageAlt="Second feature alt text"
      reverse
    />
    <VerticalFeatureRow
      title="Unique Meta Perspective"
      description="Visual analysis tools that cut through to the core of reality."
      image={Image3}
      imageAlt="Third feature alt text"
    />
  </Section>
);

export { VerticalFeatures };
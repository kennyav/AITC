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
      description="Clean data that you can see. We use the latest technology to make sure your data is safe and secure."
      image={Image1}
      imageAlt="First feature alt text"
    />
    <VerticalFeatureRow
      title="Polling"
      description="The design of our application allows for easy polling. You can create a poll and share it with your friends.  "
      image={Image2}
      imageAlt="Second feature alt text"
      reverse
    />
    <VerticalFeatureRow
      title="Node Bundling"
      description="The location of nodes indicate the location of the similar interest users. The nodes are bundled together to form a cluster to help represent the population of a specific point of view."
      image={Image3}
      imageAlt="Third feature alt text"
    />
  </Section>
);

export { VerticalFeatures };
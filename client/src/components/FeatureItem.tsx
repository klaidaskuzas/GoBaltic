interface FeatureItemProps {
  index: number;
  title: string;
  description: string;
}

const FeatureItem = ({ index, title, description }: FeatureItemProps) => {
  return (
    <div className="flex items-start group">
      <div className="flex-shrink-0 mr-5">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-primary font-bold text-lg border-2 border-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
          {index}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureItem;

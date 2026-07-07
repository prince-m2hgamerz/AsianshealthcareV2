import { Users, Building2, Stethoscope, Globe, Award, Clock } from "lucide-react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
}

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Happy Patients", icon: Users },
  { value: 130, suffix: "+", label: "Partner Hospitals", icon: Building2 },
  { value: 1000, suffix: "+", label: "Specialist Doctors", icon: Stethoscope },
  { value: 30, suffix: "+", label: "Countries Served", icon: Globe },
  { value: 500, suffix: "+", label: "Procedures Available", icon: Award },
  { value: 8, suffix: "+", label: "Years Experience", icon: Clock },
];

function Counter({ value, suffix, label, icon: Icon }: Stat) {
  return (
    <div className="text-center group">
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={22} className="text-primary" />
      </div>
      <div className="font-display text-heading-xl sm:text-display-md lg:text-display-lg text">
        {value.toLocaleString()}{suffix}
      </div>
      <p className="text-body-md text-shade-50 mt-2 font-medium">{label}</p>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="bg-white py-12 sm:py-huge border-b border-hairline-light">
      <div className="container-cinematic">
        <div className="text-center mb-12">
          <h2 className="font-display text-heading-xl lg:text-display-md text">
            Trusted by Patients Worldwide
          </h2>
          <p className="text-body-md text-shade-50 mt-2">Numbers that speak for our commitment to quality healthcare</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
          {stats.map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

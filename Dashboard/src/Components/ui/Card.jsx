export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg p-1  bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);
export const CardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-3 p-4 ${className}`}>{children}</div>;
export const CardTitle = ({ children, className = '' }) => <h3 className={`text-base font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
export const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
export const CardContent = ({ children, className = '' }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;
export const CardFooter = ({ children, className = '' }) => <div className={`flex items-center p-4 pt-0 ${className}`}>{children}</div>;

export default Card;

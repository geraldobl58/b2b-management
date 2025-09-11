import { Typography } from "@mui/material";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Typography variant="h3" component="h1" className="text-center mb-8">
          Welcome to the Applications Page
        </Typography>
      </div>
    </div>
  );
};

export default Homepage;

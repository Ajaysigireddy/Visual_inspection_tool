import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {

    const userEmail = localStorage.getItem('userEmail');
  // Define isValidUser as false initially
    let isValidUser = false;

  if (userEmail !== "null" && userEmail !== '') {
  // Add your authentication logic here to check if the userEmail is valid
  // Update isValidUser based on your authentication logic
    isValidUser = true;
}

console.log(userEmail);
console.log(isValidUser);

    // // Redirect to the login page if the user is not valid
    // if (!isValidUser) {
    //   // You can replace '/login' with the appropriate login route in your application
    //   // You may also pass state or query parameters to the login route if needed
    //   Navigate('/login');
    // }

  if (isValidUser) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoutes;

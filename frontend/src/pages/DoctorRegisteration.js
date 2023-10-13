const DoctorRegisteration = () => {
  const [formData, setFormData] = useState({
    username: "",
    realName: "",
    password: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div>
      <h2>doctor registeration page</h2>
    </div>
  );
};

export default DoctorRegisteration;

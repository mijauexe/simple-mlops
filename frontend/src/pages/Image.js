import axios from "axios";
import React, { useEffect, useState } from "react";

function Image() {
  const [customers, setCustomers] = useState([]);

  async function getCustomers() {
    const customersRes = await axios.get(process.env.REACT_APP_API_URL + "/image/");
    setCustomers(customersRes.data);
  }

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div>
      Image
    </div>
  );
}

export default Image;
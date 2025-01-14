import api from "./api";

const apiPath = import.meta.env.VITE_API_PATH
const resource = apiPath +  "/departments"


export const getAllDepartments = () => api.get(resource)
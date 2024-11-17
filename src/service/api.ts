import { FarmFieldDTO, FarmFieldGeoJSONCollection, FarmFieldProperties } from "@/model/FarmField";
import { FieldAlertDTO } from "@/model/FieldAlert";
import axios from "axios";
import { Feature, Polygon } from "geojson";

const API_BASE_URL = "http://10.140.151.112:5500/farm";

export const apiService = {
  async getFields(token: string) {
    return axios.get<FarmFieldDTO[]>(`${API_BASE_URL}/user-farms`, {headers: {Authorization:`Bearer ${token}`}}).then((res) => res.data);
  },
  dtoFieldsToFeatureCollection(fields: FarmFieldDTO[]): FarmFieldGeoJSONCollection {
    return {
      type: "FeatureCollection",
      features: fields.map((field) => field as Feature<Polygon, FarmFieldProperties>),
    }
  },
  async addField(token: string, field: FarmFieldDTO) {
    return axios.post<FarmFieldDTO>(`${API_BASE_URL}/add-farm`, field, {headers: {Authorization:`Bearer ${token}`}}).then((res) => res.data);
  },
  async updateField(token: string, field: FarmFieldDTO) {
    return axios.put<FarmFieldDTO>(`${API_BASE_URL}/update-farm`, field, {headers: {Authorization:`Bearer ${token}`}}).then((res) => res.data);
  },
  async deleteField(token: string, fieldId: string) {
    return axios.delete(`${API_BASE_URL}/delete-farm/${fieldId}`, {headers: {Authorization:`Bearer ${token}`}}).then((res) => res.data);
  },
  async getAlerts(token: string) {
    return axios.get<FieldAlertDTO[]>(`${API_BASE_URL}/get-alerts`, {headers: {Authorization:`Bearer ${token}`}}).then((res) => res.data);
  },
  async getEmployees(token: string) {
    return axios.get(`${API_BASE_URL}/get-employees`, {headers: {Authorization:`Bearer ${token}`}}).then((res) => res.data);
  },
  async addEmployee(token: string, employee: any) {
    return axios.post(`${API_BASE_URL}/add-employee`, employee, {headers: {Authorization:`Bearer ${token}`}}).then((res) => res.data);
  },
}

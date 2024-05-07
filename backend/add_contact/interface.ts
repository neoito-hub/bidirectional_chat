export interface RequesBody {
  name: string
  country_code: string
  phone_number: string
  email: string
  address?: string
  id?:string,
  registered_user: boolean
}

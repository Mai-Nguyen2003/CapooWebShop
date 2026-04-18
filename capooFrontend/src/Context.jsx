import {createContext} from "react";

export const Api = createContext("https://capoo-backend-functions-gwd0e4hfb0draaem.westeurope-01.azurewebsites.net/api");
export const SAS = createContext("?sp=r&st=2026-04-17T10:23:50Z&se=2026-06-30T15:00:00Z&spr=https&sv=2025-11-05&sr=c&sig=%2FX4DgboOVcaApweNh%2FEzn2IrfuF9y8uf%2B0vG%2BB07HP0%3D");
export const bugCat_Capoo = createContext("https://capooshopstorage.blob.core.windows.net/capooproducts/Bugcat_Capoo.jpg");
export const happyBuy = createContext("https://capooshopstorage.blob.core.windows.net/capooproducts/happyBuy.gif");

/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum FlightStatus {
    SCHEDULED = "SCHEDULED",
    BOARDING = "BOARDING",
    DELAYED = "DELAYED",
    DEPARTED = "DEPARTED",
    ARRIVED = "ARRIVED",
    CANCELLED = "CANCELLED"
}

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class CreateAircraftInput {
    manufacturerId: string;
    modelId: string;
    registrationNumber: string;
    seatCapacity: number;
}

export class UpdateAircraftInput {
    id: string;
    manufacturerId: string;
    modelId: string;
    registrationNumber: string;
    seatCapacity: number;
}

export class CreateAircraftModelInput {
    name: string;
    manufacturerId: string;
}

export class UpdateAircraftModelInput {
    id: string;
    name: string;
    manufacturerId: string;
}

export class CreateAirlineInput {
    name: string;
    code: string;
    cityId: string;
}

export class UpdateAirlineInput {
    id: string;
    name?: Nullable<string>;
    code?: Nullable<string>;
    cityId?: Nullable<string>;
}

export class CreateAirportInput {
    name: string;
    iataCode: string;
    icaoCode: string;
    cityId: string;
    timezone: string;
    latitude: number;
    longitude: number;
}

export class UpdateAirportInput {
    id: string;
    name?: Nullable<string>;
    iataCode?: Nullable<string>;
    icaoCode?: Nullable<string>;
    cityId?: Nullable<string>;
    timezone?: Nullable<string>;
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
}

export class CreateFlightInput {
    flightNumber: string;
    airlineId: string;
    aircraftId: string;
    originAirportId: string;
    destinationAirportId: string;
    departureTime: DateTime;
    arrivalTime: DateTime;
    status: FlightStatus;
}

export class UpdateFlightInput {
    id: string;
    flightNumber?: Nullable<string>;
    airlineId?: Nullable<string>;
    aircraftId?: Nullable<string>;
    originAirportId?: Nullable<string>;
    destinationAirportId?: Nullable<string>;
    departureTime?: Nullable<DateTime>;
    arrivalTime?: Nullable<DateTime>;
    status?: Nullable<FlightStatus>;
}

export class ChangeFlightStatusInput {
    flightId: string;
    status: FlightStatus;
}

export class CreateManufacturerInput {
    name: string;
    countryId: string;
}

export class UpdateManufacturerInput {
    id: string;
    name: string;
    countryId: string;
}

export interface Pagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface Response {
    message: string;
    status: number;
}

export class City {
    id: string;
    name: string;
}

export class Country {
    id: string;
    name?: Nullable<string>;
    capital?: Nullable<string>;
}

export abstract class IQuery {
    abstract _(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract aircraftList(page?: Nullable<number>, limit?: Nullable<number>): AircraftPaginationResponse | Promise<AircraftPaginationResponse>;

    abstract aircraft(id: string): Nullable<AircraftResponse> | Promise<Nullable<AircraftResponse>>;

    abstract aircraftModels(page?: Nullable<number>, limit?: Nullable<number>): AircraftPaginationResponse | Promise<AircraftPaginationResponse>;

    abstract aircraftModel(id: string): Nullable<AircraftModelResponse> | Promise<Nullable<AircraftModelResponse>>;

    abstract airlines(page?: Nullable<number>, limit?: Nullable<number>): AirlinePaginationResponse | Promise<AirlinePaginationResponse>;

    abstract airline(id: string): Nullable<AirlineResponse> | Promise<Nullable<AirlineResponse>>;

    abstract airports(page?: Nullable<number>, limit?: Nullable<number>): AirportPaginationResponse | Promise<AirportPaginationResponse>;

    abstract airport(id: string): Nullable<AirportResponse> | Promise<Nullable<AirportResponse>>;

    abstract flights(page?: Nullable<number>, limit?: Nullable<number>): FlightPaginationResponse | Promise<FlightPaginationResponse>;

    abstract flight(id: string): Nullable<FlightResponse> | Promise<Nullable<FlightResponse>>;

    abstract manufacturers(page?: Nullable<number>, limit?: Nullable<number>): ManufacturerPaginationResponse | Promise<ManufacturerPaginationResponse>;

    abstract manufacturer(id: string): Nullable<ManufacturerResponse> | Promise<Nullable<ManufacturerResponse>>;
}

export abstract class IMutation {
    abstract _(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract createAircraft(input: CreateAircraftInput): AircraftResponse | Promise<AircraftResponse>;

    abstract updateAircraft(id: string, input: UpdateAircraftInput): AircraftResponse | Promise<AircraftResponse>;

    abstract removeAircraft(id: string): AircraftResponse | Promise<AircraftResponse>;

    abstract createAircraftModel(input: CreateAircraftModelInput): AircraftModelResponse | Promise<AircraftModelResponse>;

    abstract updateAircraftModel(id: string, input: UpdateAircraftModelInput): AircraftModelResponse | Promise<AircraftModelResponse>;

    abstract removeAircraftModel(id: string): AircraftModelResponse | Promise<AircraftModelResponse>;

    abstract createAirline(input: CreateAirlineInput): AirlineResponse | Promise<AirlineResponse>;

    abstract updateAirline(id: string, input: UpdateAirlineInput): AirlineResponse | Promise<AirlineResponse>;

    abstract removeAirline(id: string): AirlineResponse | Promise<AirlineResponse>;

    abstract createAirport(input: CreateAirportInput): AirportResponse | Promise<AirportResponse>;

    abstract updateAirport(id: string, input: UpdateAirportInput): AirportResponse | Promise<AirportResponse>;

    abstract removeAirport(id: string): AirportResponse | Promise<AirportResponse>;

    abstract createFlight(input: CreateFlightInput): FlightResponse | Promise<FlightResponse>;

    abstract updateFlight(id: string, input: UpdateFlightInput): FlightResponse | Promise<FlightResponse>;

    abstract removeFlight(id: string): FlightResponse | Promise<FlightResponse>;

    abstract changeStatus(input: ChangeFlightStatusInput): Nullable<FlightResponse> | Promise<Nullable<FlightResponse>>;

    abstract createManufacturer(input: CreateManufacturerInput): ManufacturerResponse | Promise<ManufacturerResponse>;

    abstract updateManufacturer(id: string, input: UpdateManufacturerInput): ManufacturerResponse | Promise<ManufacturerResponse>;

    abstract removeManufacturer(id: string): ManufacturerResponse | Promise<ManufacturerResponse>;
}

export class Aircraft {
    id: string;
    manufacturer: Manufacturer;
    model: AircraftModel;
    registrationNumber: string;
    seatCapacity: number;
    flights: Flight[];
}

export class AircraftPagination implements Pagination {
    data?: Nullable<Aircraft[]>;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class AircraftPaginationResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<AircraftPagination>;
}

export class AircraftResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<Aircraft>;
}

export class AircraftModel {
    id: string;
    name: string;
    manufacturer: Manufacturer;
    aircraftList: Aircraft[];
}

export class AircraftModelPagination implements Pagination {
    data?: Nullable<AircraftModel[]>;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class AircraftModelPaginationResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<AircraftModelPagination>;
}

export class AircraftModelResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<AircraftModel>;
}

export class Airline {
    id: string;
    name?: Nullable<string>;
    code?: Nullable<string>;
    country?: Nullable<Country>;
    flights: Flight[];
}

export class AirlinePagination implements Pagination {
    data?: Nullable<Airline[]>;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class AirlinePaginationResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<AirlinePagination>;
}

export class AirlineResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<Airline>;
}

export class Airport {
    id: string;
    name?: Nullable<string>;
    iataCode?: Nullable<string>;
    icaoCode?: Nullable<string>;
    city?: Nullable<City>;
    timezone?: Nullable<string>;
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
}

export class AirportPagination implements Pagination {
    data?: Nullable<Airport[]>;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class AirportResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<Airport>;
}

export class AirportPaginationResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<AirportPagination>;
}

export class Flight {
    id: string;
    flightNumber: string;
    airline: Airline;
    aircraft: Aircraft;
    origin: Airport;
    destination: Airport;
    status: FlightStatus;
}

export class FlightPagination implements Pagination {
    data?: Nullable<Flight[]>;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class FlightPaginationResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<Flight>;
}

export class FlightResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<Flight>;
}

export class Manufacturer {
    id: string;
    name: string;
    countryId: string;
    country: Country;
    aircraftList: Aircraft[];
    aircraftModels: AircraftModel[];
}

export class ManufacturerPagination implements Pagination {
    data?: Nullable<Manufacturer[]>;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class ManufacturerPaginationResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<Manufacturer>;
}

export class ManufacturerResponse implements Response {
    message: string;
    status: number;
    data?: Nullable<Manufacturer>;
}

export type DateTime = any;
type Nullable<T> = T | null;

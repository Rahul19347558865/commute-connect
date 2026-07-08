import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import { useRideDetails } from '../../hooks/useRides';
import {
  useTripSession,
  useStartTrip,
  useEndTrip,
  useUpdateDriverLocation,
  useDriverLocation,
} from '../../hooks/useTrip';
import { useToast } from '../../hooks/useToast';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton, ErrorState, Button } from '../../components';
import { MapPin, Navigation, Compass, Play, Square, Activity } from '../../components/icons';

// Fix Leaflet Default Icon assets pathing problems
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Override default marker options
(L.Icon.Default.prototype as any)._getIconUrl = undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom Icons for specialized markers
const carIcon = new L.Icon({
  iconUrl: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L2hpcHBvdW5pY29ybl9jYXJfaWNvbl9vbl93aGl0ZV9iYWNrZ3JvdW5kX3Bob3RvX3Nob3BfZmxhdF92ZWN0b3JfcG5nX2FkMzdlYjU4LTVmMDctNGRjMC1iYTc0LWQ0M2Y5ODExMTM2Mi5wbmc.png',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854866.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const destIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/**
 * MapRecenter - React Leaflet subcomponent that fits viewport bounds centered
 * around route polylines whenever points load or mutate.
 */
const MapRecenter: React.FC<{ points: [number, number][] }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
};

/**
 * RideMapPage - Real-time navigation tracking page.
 * Renders leaflet OpenStreetMap tiles, calculates routes via OSRM,
 * and animates live driver location coordinates updates from Supabase telemetry.
 */
export const RideMapPage: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Queries
  const { data: ride, isLoading: isRideLoading, error: rideError } = useRideDetails(rideId || '');
  const { data: session, isLoading: isSessionLoading } = useTripSession(rideId || '');
  const { data: location } = useDriverLocation(rideId || '');

  // Mutations
  const { mutateAsync: startTrip, isPending: isStarting } = useStartTrip();
  const { mutateAsync: endTrip, isPending: isEnding } = useEndTrip();
  const { mutateAsync: updateLocation } = useUpdateDriverLocation();

  const isDriver = ride && user && ride.driver_id === user.id;

  // Local state for routes
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<string>('Calculated on fly...');
  const [eta, setEta] = useState<string>('Pending start');
  const [isSimulating, setIsSimulating] = useState(false);

  const simulationIntervalRef = useRef<number | null>(null);

  // 1. Fetch route geometry via OSRM public routing API
  useEffect(() => {
    if (!ride) return;

    const fetchRoute = async () => {
      try {
        const pickupLat = ride.pickup_latitude;
        const pickupLon = ride.pickup_longitude;
        const destLat = ride.destination_latitude;
        const destLon = ride.destination_longitude;

        const url = `https://router.project-osrm.org/route/v1/driving/${pickupLon},${pickupLat};${destLon},${destLat}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('OSRM routing request failed.');
        
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // Convert OSRM [lon, lat] array list to Leaflet [lat, lon]
          const points = route.geometry.coordinates.map((coords: [number, number]) => [coords[1], coords[0]]);
          setRoutePoints(points);

          // Format distance and durations
          const distKm = (route.distance / 1000).toFixed(1);
          const durationMin = Math.round(route.duration / 60);
          setDistance(`${distKm} km`);
          setEta(`${durationMin} mins`);
        }
      } catch (err) {
        console.warn('Routing Service error:', err);
      }
    };

    fetchRoute();
  }, [ride]);

  // 2. Real Geolocation watchers for Driver trip update loops
  useEffect(() => {
    if (!isDriver || session?.status !== 'active' || isSimulating) return;

    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation({ rideId: rideId!, latitude, longitude });
        },
        (error) => {
          console.warn('GPS Telemetry Watch failure:', error.message);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isDriver, session?.status, rideId, isSimulating, updateLocation]);

  // 3. Fallback Route Simulator for testing maps updates smoothly
  const handleToggleSimulation = () => {
    if (isSimulating) {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      setIsSimulating(false);
      return;
    }

    if (routePoints.length === 0) return;

    setIsSimulating(true);
    let step = 0;

    simulationIntervalRef.current = window.setInterval(async () => {
      if (step >= routePoints.length) {
        clearInterval(simulationIntervalRef.current!);
        setIsSimulating(false);
        toast('success', 'Simulation reached the destination point.');
        return;
      }

      const [lat, lon] = routePoints[step];
      await updateLocation({ rideId: rideId!, latitude: lat, longitude: lon });
      step += Math.max(1, Math.floor(routePoints.length / 25)); // Steps index increment
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, []);

  const handleStartTrip = async () => {
    try {
      await startTrip(rideId!);
      toast('success', 'Trip started! Location telemetry streaming online.');
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to start trip.');
    }
  };

  const handleEndTrip = async () => {
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    setIsSimulating(false);
    try {
      await endTrip(rideId!);
      toast('success', 'Trip completed successfully!');
      navigate(`/rides/${rideId}`);
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to complete trip.');
    }
  };

  const isLoading = isRideLoading || isSessionLoading;

  if (isLoading) {
    return (
      <DashboardLayout activeTab="routes">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton variant="rect" height="400px" />
        </div>
      </DashboardLayout>
    );
  }

  if (rideError || !ride) {
    return (
      <DashboardLayout activeTab="routes">
        <ErrorState
          title="Trip Not Found"
          message={rideError?.message || 'Error occurred retrieving pool coordinates details.'}
          onRetry={() => navigate('/rides')}
        />
      </DashboardLayout>
    );
  }

  const pickupLat = ride.pickup_latitude;
  const pickupLon = ride.pickup_longitude;
  const destLat = ride.destination_latitude;
  const destLon = ride.destination_longitude;

  // Driver marker positioning (defaults to pickup point if no update is uploaded yet)
  const driverPosition: [number, number] = location
    ? [Number(location.latitude), Number(location.longitude)]
    : [pickupLat, pickupLon];

  const pointsToFit: [number, number][] = routePoints.length > 0
    ? routePoints
    : [[pickupLat, pickupLon], [destLat, destLon]];

  return (
    <DashboardLayout activeTab="routes">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Navigation Headings */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-7 h-7 text-brand-primary" />
              Live Commute Tracker
            </h1>
            <p className="text-small text-neutral-textSub dark:text-slate-400">
              Track ride sharing routes and driver locations in real time.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
            Back
          </Button>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaflet Map Frame (Column 1-2) */}
          <Card className="lg:col-span-2 overflow-hidden border border-neutral-borderLine dark:border-slate-800 shadow-shadow-medium h-[450px]">
            <MapContainer
              center={[pickupLat, pickupLon]}
              zoom={13}
              style={{ width: '100%', height: '100%', zIndex: 10 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Recenter viewport */}
              <MapRecenter points={pointsToFit} />

              {/* Start Pin */}
              <Marker position={[pickupLat, pickupLon]} icon={pickupIcon}>
                <Popup>Pickup Location: {ride.pickup_location}</Popup>
              </Marker>

              {/* End Pin */}
              <Marker position={[destLat, destLon]} icon={destIcon}>
                <Popup>Destination Location: {ride.destination}</Popup>
              </Marker>

              {/* Driver Marker */}
              {session?.status === 'active' && (
                <Marker position={driverPosition} icon={carIcon}>
                  <Popup>Driver: {ride.driver?.full_name}</Popup>
                </Marker>
              )}

              {/* Route Polyline path */}
              {routePoints.length > 0 && (
                <Polyline positions={routePoints} color="#1d4ed8" weight={5} opacity={0.7} />
              )}
            </MapContainer>
          </Card>

          {/* Telemetry info and Trip Buttons (Column 3) */}
          <Card className="lg:col-span-1 border border-neutral-borderLine dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-small font-bold">Ride Metrics</CardTitle>
                <Badge
                  variant={
                    session?.status === 'active'
                      ? 'success'
                      : session?.status === 'completed'
                      ? 'default'
                      : 'warning'
                  }
                  className="capitalize font-bold"
                >
                  {session?.status || 'upcoming'}
                </Badge>
              </div>
              <CardDescription>Real-time vehicle trip measurements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-small">
              {/* Telemetry readouts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-850 rounded">
                  <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Distance</span>
                  <p className="font-bold text-neutral-textMain dark:text-slate-100 mt-1">{distance}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-850 rounded">
                  <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Estimated Duration</span>
                  <p className="font-bold text-neutral-textMain dark:text-slate-100 mt-1">{eta}</p>
                </div>
              </div>

              {/* Addresses details */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-textSub font-bold">FROM</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 line-clamp-1">{ride.pickup_location}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-textSub font-bold">TO</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 line-clamp-1">{ride.destination}</p>
                  </div>
                </div>
              </div>

              {/* Action Operations for Drivers */}
              {isDriver && (
                <div className="space-y-3 pt-4 border-t border-neutral-borderLine dark:border-slate-800">
                  {session?.status !== 'active' && session?.status !== 'completed' && (
                    <Button
                      variant="primary"
                      loading={isStarting}
                      leftIcon={<Play className="w-4 h-4" />}
                      onClick={handleStartTrip}
                      className="w-full h-10 font-bold"
                    >
                      Start Trip
                    </Button>
                  )}

                  {session?.status === 'active' && (
                    <div className="space-y-3">
                      <Button
                        variant="danger"
                        loading={isEnding}
                        leftIcon={<Square className="w-4 h-4" />}
                        onClick={handleEndTrip}
                        className="w-full h-10 font-bold"
                      >
                        End Trip
                      </Button>

                      <Button
                        variant="secondary"
                        leftIcon={<Compass className="w-4 h-4" />}
                        onClick={handleToggleSimulation}
                        className={`w-full h-10 font-semibold ${isSimulating ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
                      >
                        {isSimulating ? 'Pause Route Simulation' : 'Simulate GPS Coordinates'}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Passenger tracking guide */}
              {!isDriver && session?.status === 'active' && (
                <div className="p-3 bg-blue-50/20 dark:bg-blue-950/10 border border-brand-primary/10 rounded flex items-start gap-2.5">
                  <Navigation className="w-5 h-5 text-brand-primary shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-tiny text-brand-primary font-medium leading-relaxed">
                    Trip is currently active! Track the vehicle position marker moving in real-time coordinates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default RideMapPage;

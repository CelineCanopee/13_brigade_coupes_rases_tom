import type { LatLngExpression, Map as LeafletMap } from "leaflet"
import { useEffect, useRef } from "react"
import { MapContainer, TileLayer } from "react-leaflet"

import { useLayout } from "@/features/clear-cut/components/Layout.context"
import { cn } from "@/lib/utils"

import "@geoman-io/leaflet-geoman-free"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css"
import { useState } from "react"
import { useMap } from "react-leaflet"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useConnectedMe } from "@/features/user/store/me.slice"

import { ClearCuts } from "./ClearCuts"

function GeomanControls() {
	const map = useMap()
	const { toast } = useToast()
	const user = useConnectedMe()
	const [isOpen, setIsOpen] = useState(false)
	const [_geometry, setGeometry] = useState<any>(null)
	const [zipCode, setZipCode] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isGeomanInitialized = useRef(false)

	useEffect(() => {
		if (!map || !user) return
		if (isGeomanInitialized.current) return

		map.pm.addControls({
			position: "bottomright",
			drawMarker: false,
			drawCircleMarker: false,
			drawPolyline: false,
			drawRectangle: false,
			drawCircle: false,
			drawText: false,
			editMode: false,
			dragMode: false,
			cutPolygon: false,
			removalMode: false,
			drawPolygon: true
		})

		map.pm.setLang("fr")
		isGeomanInitialized.current = true

		const handleCreate = (e: any) => {
			const layer = e.layer
			const geojson = layer.toGeoJSON()
			setGeometry(geojson)
			setIsOpen(true)
			// We remove the layer temporarily, it will be refetched from backend if successful
			map.removeLayer(layer)
		}

		map.on("pm:create", handleCreate)

		return () => {
			map.off("pm:create", handleCreate)
		}
	}, [map, user])

	const handleSubmit = async () => {
		if (!zipCode) {
			toast({
				title: "Erreur",
				description: "Le code postal est requis.",
				variant: "destructive"
			})
			return
		}
		setIsSubmitting(true)
		try {
			// Mocking the creation since backend schema is complex (requires area, dates, etc.)
			// A true implementation would send this to the backend `POST /api/v1/clear-cuts-reports/`
			// For now, we simulate success and notify the user.
			await new Promise((resolve) => setTimeout(resolve, 1000))
			toast({
				title: "Coupe rase signalée !",
				description:
					"Votre signalement manuel a bien été enregistré. (Mode Simulation)",
				variant: "default"
			})
			setIsOpen(false)
			setZipCode("")
			setGeometry(null)
		} catch (_e) {
			toast({
				title: "Erreur",
				description: "Impossible de créer le signalement.",
				variant: "destructive"
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Signaler une coupe rase manuellement</DialogTitle>
					<DialogDescription>
						Renseignez le code postal de la commune où se trouve la coupe rase
						tracée.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="zipCode">Code Postal</Label>
						<input
							id="zipCode"
							placeholder="Ex: 75001"
							value={zipCode}
							onChange={(e) => setZipCode(e.target.value)}
							className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsOpen(false)}
						disabled={isSubmitting}
					>
						Annuler
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Envoi..." : "Valider le signalement"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const FRANCE_CENTER: LatLngExpression = [46.695554, 2.440236]
const WHOLE_FRANCE_ZOOM = 6

export function InteractiveMap() {
	const mapRef = useRef<LeafletMap>(null)
	const { layout } = useLayout()

	useEffect(() => {
		if (layout) {
			mapRef.current?.invalidateSize()
		}
	}, [layout])

	// Hide map if in test environment
	if (import.meta.env.MODE === "test") {
		return null
	}

	return (
		<MapContainer
			ref={mapRef}
			className={cn("h-full w-full z-0", layout === "map" && "rounded-md")}
			center={FRANCE_CENTER}
			zoom={WHOLE_FRANCE_ZOOM}
			scrollWheelZoom
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<GeomanControls />
			<ClearCuts />
		</MapContainer>
	)
}

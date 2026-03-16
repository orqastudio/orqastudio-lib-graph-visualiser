/**
 * GraphVisualiser — reactive Svelte 5 wrapper around graph analysis.
 *
 * Consumes graph data from the SDK (via a ReadonlyMap<string, ArtifactNode>)
 * and provides reactive derived properties for health, backbone, gaps,
 * and visualization elements.
 *
 * Usage:
 *   const viz = new GraphVisualiser();
 *   viz.update(artifactGraphSDK.graph);  // call after each graph refresh
 *   viz.graphHealth       // reactive
 *   viz.backboneArtifacts // reactive
 *   viz.knowledgeGaps     // reactive
 *   viz.graphElements     // reactive
 */
import cytoscape from "cytoscape";
import type { ArtifactNode } from "@orqastudio/types";
import type { GraphHealth, BackboneArtifact, KnowledgeGaps, ImpactResult, NodePosition } from "./types.js";
export declare class GraphVisualiser {
    /** Cached headless Cytoscape instance. Rebuilt on each update(). */
    private _cy;
    /** Current graph data reference. */
    private _graph;
    /** Version counter for reactive tracking. */
    private _version;
    /** Cached node positions from the last layout computation. */
    cachedPositions: NodePosition[];
    /**
     * Update the visualiser with new graph data.
     * Call this whenever the SDK's graph refreshes.
     */
    update(graph: ReadonlyMap<string, ArtifactNode>): void;
    graphHealth: GraphHealth;
    backboneArtifacts: BackboneArtifact[];
    knowledgeGaps: KnowledgeGaps;
    graphElements: cytoscape.ElementDefinition[];
    /** BFS trace from an artifact. */
    traceChain(id: string, direction: "up" | "down"): string[];
    /** Impact radius analysis. */
    impactOf(id: string, maxDepth?: number): ImpactResult;
    private _getCy;
}
//# sourceMappingURL=visualiser.svelte.d.ts.map
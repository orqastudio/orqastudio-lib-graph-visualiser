/**
 * Pure-function graph analysis — no Svelte reactivity.
 *
 * Each function takes a Cytoscape core instance and the graph data,
 * returns computed results. The reactive layer (Svelte $derived) lives
 * in the GraphVisualiser class.
 */
import type cytoscape from "cytoscape";
import type { ArtifactNode } from "@orqastudio/types";
import type { GraphHealth, BackboneArtifact, KnowledgeGaps, ImpactResult } from "./types.js";
/** Compute structural health metrics from a Cytoscape instance. */
export declare function computeGraphHealth(cy: cytoscape.Core): GraphHealth;
/** Compute top-N artifacts by PageRank. */
export declare function computeBackboneArtifacts(cy: cytoscape.Core, graph: ReadonlyMap<string, ArtifactNode>, topN?: number): BackboneArtifact[];
/** Detect knowledge gaps from the relationship graph. */
export declare function computeKnowledgeGaps(graph: ReadonlyMap<string, ArtifactNode>): KnowledgeGaps;
/**
 * BFS trace from an artifact following the graph topology.
 *
 * - `'up'`   — follow edges TO the node (who references this?).
 * - `'down'` — follow edges FROM the node (what does this reference?).
 *
 * Returns an ordered array of artifact IDs visited during BFS,
 * not including the starting node itself.
 */
export declare function traceChain(cy: cytoscape.Core, id: string, direction: "up" | "down"): string[];
/**
 * Return all artifacts within `maxDepth` hops from the given node.
 */
export declare function computeImpact(cy: cytoscape.Core, graph: ReadonlyMap<string, ArtifactNode>, id: string, maxDepth?: number): ImpactResult;
//# sourceMappingURL=analysis.d.ts.map
/**
 * Build Cytoscape element definitions from artifact graph data.
 */
import type cytoscape from "cytoscape";
import type { ArtifactNode } from "@orqastudio/types";
/**
 * Build a headless Cytoscape-compatible element array from graph data.
 * Used internally by the visualiser for analysis (PageRank, components, BFS).
 */
export declare function buildAnalysisElements(graph: ReadonlyMap<string, ArtifactNode>): cytoscape.ElementDefinition[];
/**
 * Build visualization-ready Cytoscape elements with colors, labels, tooltips.
 * Edges are deduplicated by source→target pair.
 */
export declare function buildVisualizationElements(graph: ReadonlyMap<string, ArtifactNode>): cytoscape.ElementDefinition[];
//# sourceMappingURL=elements.d.ts.map
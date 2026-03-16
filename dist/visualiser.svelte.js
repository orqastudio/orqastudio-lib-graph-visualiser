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
import { computeGraphHealth, computeBackboneArtifacts, computeKnowledgeGaps, traceChain as _traceChain, computeImpact } from "./analysis.js";
import { buildAnalysisElements, buildVisualizationElements } from "./elements.js";
export class GraphVisualiser {
    /** Cached headless Cytoscape instance. Rebuilt on each update(). */
    _cy = null;
    /** Current graph data reference. */
    _graph = new Map();
    /** Version counter for reactive tracking. */
    _version = $state(0);
    /** Cached node positions from the last layout computation. */
    cachedPositions = $state([]);
    // -----------------------------------------------------------------------
    // Lifecycle
    // -----------------------------------------------------------------------
    /**
     * Update the visualiser with new graph data.
     * Call this whenever the SDK's graph refreshes.
     */
    update(graph) {
        this._graph = graph;
        if (this._cy) {
            this._cy.destroy();
            this._cy = null;
        }
        this._version++;
        this.cachedPositions = [];
    }
    // -----------------------------------------------------------------------
    // Reactive derived properties
    // -----------------------------------------------------------------------
    graphHealth = $derived.by(() => {
        void this._version;
        return computeGraphHealth(this._getCy());
    });
    backboneArtifacts = $derived.by(() => {
        void this._version;
        return computeBackboneArtifacts(this._getCy(), this._graph);
    });
    knowledgeGaps = $derived.by(() => {
        void this._version;
        return computeKnowledgeGaps(this._graph);
    });
    graphElements = $derived.by(() => {
        void this._version;
        return buildVisualizationElements(this._graph);
    });
    // -----------------------------------------------------------------------
    // Imperative analysis methods
    // -----------------------------------------------------------------------
    /** BFS trace from an artifact. */
    traceChain(id, direction) {
        return _traceChain(this._getCy(), id, direction);
    }
    /** Impact radius analysis. */
    impactOf(id, maxDepth = 2) {
        return computeImpact(this._getCy(), this._graph, id, maxDepth);
    }
    // -----------------------------------------------------------------------
    // Private
    // -----------------------------------------------------------------------
    _getCy() {
        if (this._cy)
            return this._cy;
        this._cy = cytoscape({ elements: buildAnalysisElements(this._graph), headless: true });
        return this._cy;
    }
}
//# sourceMappingURL=visualiser.svelte.js.map
/**
 * Pure-function graph analysis — no Svelte reactivity.
 *
 * Each function takes a Cytoscape core instance and the graph data,
 * returns computed results. The reactive layer (Svelte $derived) lives
 * in the GraphVisualiser class.
 */
/** Compute structural health metrics from a Cytoscape instance. */
export function computeGraphHealth(cy) {
    const totalNodes = cy.nodes().length;
    const totalEdges = cy.edges().length;
    if (totalNodes === 0) {
        return { componentCount: 0, orphanCount: 0, orphanPercentage: 0, avgDegree: 0, largestComponentRatio: 0, totalNodes: 0, totalEdges: 0 };
    }
    const components = cy.elements().components();
    const componentCount = components.length;
    const largestComponentSize = Math.max(...components.map((c) => c.nodes().length));
    const largestComponentRatio = largestComponentSize / totalNodes;
    const orphanCount = cy.nodes().filter((n) => n.indegree(false) === 0).length;
    const orphanPercentage = Math.round((orphanCount / totalNodes) * 1000) / 10;
    const avgDegree = Math.round(((totalEdges * 2) / totalNodes) * 10) / 10;
    return { componentCount, orphanCount, orphanPercentage, avgDegree, largestComponentRatio, totalNodes, totalEdges };
}
/** Compute top-N artifacts by PageRank. */
export function computeBackboneArtifacts(cy, graph, topN = 10) {
    if (cy.nodes().length === 0)
        return [];
    const pr = cy.elements().pageRank({});
    const scored = cy.nodes().map((n) => ({
        id: n.id(),
        rank: pr.rank(n),
    }));
    scored.sort((a, b) => b.rank - a.rank);
    return scored.slice(0, topN).map(({ id, rank }) => {
        const node = graph.get(id);
        return {
            id,
            title: node?.title ?? id,
            type: node?.artifact_type ?? "unknown",
            rank,
        };
    });
}
/** Detect knowledge gaps from the relationship graph. */
export function computeKnowledgeGaps(graph) {
    const ungroundedRules = [];
    const unusedSkills = [];
    const unenforcedDecisions = [];
    for (const node of graph.values()) {
        if (node.artifact_type === "rule") {
            const hasGrounding = node.references_out.some((r) => r.relationship_type === "grounded-by" && graph.get(r.target_id)?.artifact_type === "pillar");
            if (!hasGrounding)
                ungroundedRules.push(node.id);
        }
        else if (node.artifact_type === "skill") {
            const hasPractitioner = node.references_in.some((r) => r.relationship_type === "grounded-by" && graph.get(r.source_id)?.artifact_type === "agent");
            if (!hasPractitioner)
                unusedSkills.push(node.id);
        }
        else if (node.artifact_type === "decision") {
            const hasGovernsOrDrives = node.references_out.some((r) => r.relationship_type === "governs" || r.relationship_type === "drives");
            if (!hasGovernsOrDrives)
                unenforcedDecisions.push(node.id);
        }
    }
    return { ungroundedRules, unusedSkills, unenforcedDecisions };
}
/**
 * BFS trace from an artifact following the graph topology.
 *
 * - `'up'`   — follow edges TO the node (who references this?).
 * - `'down'` — follow edges FROM the node (what does this reference?).
 *
 * Returns an ordered array of artifact IDs visited during BFS,
 * not including the starting node itself.
 */
export function traceChain(cy, id, direction) {
    const startNode = cy.getElementById(id);
    if (startNode.empty())
        return [];
    const visited = [];
    const seen = new Set([id]);
    const queue = [id];
    while (queue.length > 0) {
        const current = queue.shift();
        const cyNode = cy.getElementById(current);
        const neighbours = direction === "up"
            ? cyNode.incomers("node")
            : cyNode.outgoers("node");
        neighbours.forEach((n) => {
            const nid = n.id();
            if (!seen.has(nid)) {
                seen.add(nid);
                visited.push(nid);
                queue.push(nid);
            }
        });
    }
    return visited;
}
/**
 * Return all artifacts within `maxDepth` hops from the given node.
 */
export function computeImpact(cy, graph, id, maxDepth = 2) {
    const startNode = cy.getElementById(id);
    if (startNode.empty())
        return { total: 0, artifacts: [] };
    const results = [];
    const seen = new Set([id]);
    let frontier = [id];
    for (let depth = 1; depth <= maxDepth; depth++) {
        const nextFrontier = [];
        for (const current of frontier) {
            const cyNode = cy.getElementById(current);
            cyNode.neighborhood("node").forEach((n) => {
                const nid = n.id();
                if (!seen.has(nid)) {
                    seen.add(nid);
                    const node = graph.get(nid);
                    results.push({ id: nid, type: node?.artifact_type ?? "unknown", distance: depth });
                    nextFrontier.push(nid);
                }
            });
        }
        frontier = nextFrontier;
    }
    return { total: results.length, artifacts: results };
}
//# sourceMappingURL=analysis.js.map
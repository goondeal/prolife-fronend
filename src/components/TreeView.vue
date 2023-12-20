<template>
    <div class="tree-container" ref="treeContainer">
        <div class="flex">
            <button @click="zoomIn">zoom in</button>
            <button @click="zoomOut">zoom out</button>
            <button @click="restoreScale">reset</button>
        </div>
        <svg class="svg vue-tree" ref="svgElement" :style="initialTransformStyle"></svg>
        <div class="dom-container" ref="domElement" :style="initialTransformStyle">
            <transition-group name="tree-node-item" tag="div">
                <div class="node-slot" v-for="(node, index) of nodeDataList" :key="node.data._key" :style="{
                    left: formatDimension(isVertical ? node.x : node.y),
                    top: formatDimension(isVertical ? node.y : node.x),
                    width: formatDimension(NODE_WIDTH),
                    height: formatDimension(NODE_HEIGHT),
                }">
                    <div>{{ index }} - {{ node.data.name }}</div>
                    <!-- <slot name="node" @click="onClickNode(index)" v-bind:node="node.data"
                        v-bind:collapsed="node.data._collapsed">
                        <span>{{ node.data.name }}</span>
                    </slot>
                    <slot name="options" v-bind:node="node.data"></slot> -->
                </div>
            </transition-group>
        </div>
    </div>
</template>
  
  
<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import * as d3 from "d3"

const data = {
    name: "Eve",
    tasks: [
        { name: "Cain" },
        { name: "Seth", tasks: [{ name: "Enos" }, { name: "Noam" }] },
        { name: "Abel" },
        { name: "Awan", tasks: [{ name: "Enoch" }] },
        { name: "Azura" }
    ]
};

// Constants
const NODE_WIDTH = 100;
const NODE_HEIGHT = 100;
const LEVEL_HEIGHT = 200;
const DEFAULT_HEIGHT_DECREMENT = 200;
const LINK_STYLE_CURVE = 'C';
const LINK_STYLE_STRAIT = 'S';
const DIRECTION_VERTICAL = 'V';
// const DIRECTION_HORIZONTAL = 'H';
// const COLLAPSABLE = true;
const MATCH_TRANSLATE_REGEX = /translate\((-?\d+)px, ?(-?\d+)px\)/i;
const MATCH_SCALE_REGEX = /scale\((\S*)\)/i;

// Data
const dataset = ref(data)
const nodeDataList = ref([])
const linkDataList = ref([])

// options
const currentScale = ref(1)
const linkStyle = ref(LINK_STYLE_CURVE)
const direction = ref(DIRECTION_VERTICAL)
const isVertical = computed(() => direction.value === DIRECTION_VERTICAL)
const initTransformX = ref()
const initTransformY = ref()
const initialTransformStyle = ref({})

// element refs
const treeContainer = ref(null)
const svgElement = ref(null)
const domElement = ref(null)


// Methods
let uid = 0;
const getUniqueId = () => uid++;
const deepCopy = (node) => {
    let obj = { _key: getUniqueId() };
    for (var key in node) {
        if (node[key] === null) {
            obj[key] = null;
        } else if (Array.isArray(node[key])) {
            obj[key] = node[key].map((x) => deepCopy(x));
        } else if (typeof node[key] === "object") {
            obj[key] = deepCopy(node[key]);
        } else {
            obj[key] = node[key];
        }
    }
    return obj;
}
const updatedInternalData = (externalData) => {
    var data = { name: "__invisible_root", tasks: [] };
    if (!externalData) return data;
    if (Array.isArray(externalData)) {
        for (var i = externalData.length - 1; i >= 0; i--) {
            data.tasks.push(deepCopy(externalData[i]));
        }
    } else {
        data.tasks.push(deepCopy(externalData));
    }
    return data;
}
// const updateDataset = (dataset) => {
//     dataset.value = updatedInternalData(dataset);
//     draw();
//   }

const formatDimension = (dimension) => {
    if (typeof dimension === "number") return `${dimension}px`;
    if (dimension.indexOf("px") !== -1) {
        return dimension;
    } else {
        return `${dimension}px`;
    }
}

const getInitialTransformStyle = computed(() => {
    return {
        transform: `scale(1) translate(${initTransformX.value}px, ${initTransformY.value}px)`,
        transformOrigin: "center",
    }
})

const buildTree = () => {
    const treeBuilder = d3.tree().nodeSize([NODE_WIDTH, LEVEL_HEIGHT]);
    const tree = treeBuilder(d3.hierarchy(dataset.value, (d) => d['tasks']));
    return [tree.descendants(), tree.links()];
}

const rotatePoint = ({ x, y }) => {
    return { x: y, y: x }
}

const generateCurceLinkPath = (d) => {
    const linkPath = isVertical.value
        ? d3.linkVertical()
        : d3.linkHorizontal();
    linkPath
        .x((d) => d.x)
        .y((d) => d.y)
        .source(function (d) {
            const sourcePoint = {
                x: d.source.x,
                y: d.source.y,
            };
            return direction.value === DIRECTION_VERTICAL
                ? sourcePoint
                : rotatePoint(sourcePoint);
        })
        .target(function (d) {
            const targetPoint = {
                x: d.target.x,
                y: d.target.y,
            };
            return direction.value === DIRECTION_VERTICAL
                ? targetPoint
                : rotatePoint(targetPoint);
        });
    return linkPath(d);
}

const generateStraightLinkPath = (d) => {
    const linkPath = d3.path();
    let sourcePoint = { x: d.source.x, y: d.source.y };
    let targetPoint = { x: d.target.x, y: d.target.y };
    if (isVertical.value) {
        sourcePoint = rotatePoint(sourcePoint);
        targetPoint = rotatePoint(targetPoint);
    }
    const xOffset = targetPoint.x - sourcePoint.x;
    const yOffset = targetPoint.y - sourcePoint.y;
    const secondPoint = isVertical.value
        ? { x: sourcePoint.x, y: sourcePoint.y + yOffset / 2 }
        : { x: sourcePoint.x + xOffset / 2, y: sourcePoint.y };
    const thirdPoint = isVertical.value
        ? { x: targetPoint.x, y: sourcePoint.y + yOffset / 2 }
        : { x: sourcePoint.x + xOffset / 2, y: targetPoint.y };
    linkPath.moveTo(sourcePoint.x, sourcePoint.y);
    linkPath.lineTo(secondPoint.x, secondPoint.y);
    linkPath.lineTo(thirdPoint.x, thirdPoint.y);
    linkPath.lineTo(targetPoint.x, targetPoint.y);
    return linkPath.toString();
}


const generateLinkPath = (d) => {
    if (linkStyle.value === LINK_STYLE_CURVE) {
        return generateCurceLinkPath(d);
    }
    if (linkStyle.value === LINK_STYLE_STRAIT) {
        // the link path is: source -> secondPoint -> thirdPoint -> target
        return generateStraightLinkPath(d);
    }
}
const updateDataList = () => {
    let tree = buildTree()
    let nodes = tree[0]
    let links = tree[1]
    nodes.splice(0, 1);
    links = links.filter(
        (x) => x.source.data.name !== "__invisible_root"
    );
    linkDataList.value = links;
    nodeDataList.value = nodes;
    console.log('nodeDataList =', nodeDataList.value)
}
const draw = () => {
    updateDataList();
    const identifier = dataset.value["identifier"];
    const specialLinks = dataset.value["links"];
    if (specialLinks && identifier) {
        for (const link of specialLinks) {
            let parent, children = undefined;
            if (identifier === "value") {
                parent = nodeDataList.value.find((d) => d[identifier] == link.parent);
                children = nodeDataList.value.filter((d) => d[identifier] == link.child);
            } else {
                parent = nodeDataList.value.find((d) => d["data"][identifier] == link.parent);
                children = nodeDataList.value.filter((d) => d["data"][identifier] == link.child);
            }
            if (parent && children) {
                for (const child of children) {
                    const new_link = {
                        source: parent,
                        target: child,
                    };
                    linkDataList.value.push(new_link);
                }
            }
        }
    }

    // this.svgSelection = d3.select(svgElement.value);

    const links = d3
        .select(svgElement.value)
        .selectAll(".link")
        .data(linkDataList.value, (d) => `${d.source.data._key}-${d.target.data._key}`);

    links
        .enter()
        .append("path")
        .style("opacity", 0)
        .transition()
        .style("opacity", 1)
        .attr("class", "link")
        .attr("d", (d) => generateLinkPath(d));
    links
        .transition()
        .attr("d", (d) => generateLinkPath(d));
    links
        .exit()
        .transition()
        .style("opacity", 0)
        .remove();
}
const enableDrag = () => {
    let startX = 0;
    let startY = 0;
    let isDrag = false;
    // 保存鼠标点下时的位移
    let mouseDownTransform = "";
    treeContainer.value.onmousedown = (event) => {
        mouseDownTransform = svgElement.value.style.transform;
        startX = event.clientX;
        startY = event.clientY;
        isDrag = true;
    };
    treeContainer.value.onmousemove = (event) => {
        if (!isDrag) return;
        const originTransform = mouseDownTransform;
        let originOffsetX = 0;
        let originOffsetY = 0;
        if (originTransform) {
            const result = originTransform.match(MATCH_TRANSLATE_REGEX);
            if (result !== null && result.length !== 0) {
                const [offsetX, offsetY] = result.slice(1);
                originOffsetX = parseInt(offsetX);
                originOffsetY = parseInt(offsetY);
            }
        }
        let newX =
            Math.floor((event.clientX - startX) / currentScale.value) +
            originOffsetX;
        let newY =
            Math.floor((event.clientY - startY) / currentScale.value) +
            originOffsetY;
        let transformStr = `translate(${newX}px, ${newY}px)`;
        if (originTransform) {
            transformStr = originTransform.replace(
                MATCH_TRANSLATE_REGEX,
                transformStr
            );
        }
        svgElement.value.style.transform = transformStr;
        domElement.value.style.transform = transformStr;
    };

    treeContainer.value.onmouseup = () => {
        startX = 0;
        startY = 0;
        isDrag = false;
    };
}
const initTransform = () => {
    const containerWidth = domElement.value.offsetWidth;
    const containerHeight = domElement.value.offsetHeight;
    if (isVertical.value) {
        initTransformX.value = Math.floor(containerWidth / 2);
        initTransformY.value = Math.floor(
            NODE_HEIGHT - DEFAULT_HEIGHT_DECREMENT
        );
    } else {
        initTransformX.value = Math.floor(
            NODE_WIDTH - DEFAULT_HEIGHT_DECREMENT
        );
        initTransformY.value = Math.floor(containerHeight / 2);
    }
}
const init = () => {
    dataset.value = updatedInternalData(dataset.value);
    draw();
    enableDrag();
    initTransform();
    initialTransformStyle.value = getInitialTransformStyle.value;
}

const getTranslate = () => {
    let string = svgElement.value.style.transform;
    let match = string.match(MATCH_TRANSLATE_REGEX);
    if (match === null) {
        return [null, null];
    }
    let x = parseInt(match[1]);
    let y = parseInt(match[2]);
    return [x, y];
}
const setScale = (scaleNum) => {
    if (typeof scaleNum !== "number") return;
    let pos = getTranslate();
    let translateString = `translate(${pos[0]}px, ${pos[1]}px)`;
    svgElement.value.style.transform = `scale(${scaleNum}) ` + translateString;
    domElement.value.style.transform =
        `scale(${scaleNum}) ` + translateString;
    currentScale.value = scaleNum;
}
const zoomIn = () => {
    const originTransformStr = domElement.value.style.transform;
    let targetScale = 1 * 1.2;
    const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX);
    if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1]);
        targetScale *= originScale;
    }
    setScale(targetScale);
}

const zoomOut = () => {
    const originTransformStr = domElement.value.style.transform;
    let targetScale = 1 / 1.2;
    const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX);
    if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1]);
        targetScale = originScale / 1.2;
    }
    setScale(targetScale);
}

const restoreScale = () => setScale(1);

onMounted(() => {
    init()
})

onBeforeUnmount(() => {
    treeContainer.value = null
    svgElement.value = null
    domElement.value = null
})
// onClickNode(index) {
//     this.treeChartCore.onClickNode(index);
//     nodeDataList.value = this.treeChartCore.getNodeDataList();
// }
// data() {
//     return {
//         formatDimension,
//         Direction,
//         treeChartCore: null,
//         nodeDataList: [],
//         initialTransformStyle: {},
//     };
// },
// watch: {
//     dataset: {
//         deep: true,
//             handler: function () {
//                 this.treeChartCore.updateDataset(this.dataset);
//                 nodeDataList.value = this.treeChartCore.getNodeDataList();
//             },
//     },
// }


</script>


<style>
.tree-container .node {
    fill: grey !important;
}

.tree-container .link {
    stroke-width: 2px !important;
    fill: transparent !important;
    stroke: #cecece !important;

}
</style>

<style scoped>
.tree-node-item-enter,
.tree-node-item-leave-to {
    transition-timing-function: ease-in-out;
    transition: transform 0.8s;
    opacity: 0;
}

.tree-node-item-enter-active,
.tree-node-item-leave-active {
    transition-timing-function: ease-in-out;
    transition: all 0.8s;
}

.tree-container {
    position: relative;
    overflow: hidden;
}

.tree-container .vue-tree {
    position: relative;
}

.tree-container svg,
.tree-container .dom-container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    transform-origin: 0 50%;
}

.tree-container .dom-container {
    z-index: 1;
    pointer-events: none;

}

.node-slot {
    cursor: pointer;
    pointer-events: all;
    position: absolute;
    background-color: transparent;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    transition: all 0.8s;
    transition-timing-function: ease-in-out;
}
</style>

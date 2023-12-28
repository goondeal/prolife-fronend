<template>
    <div class="h-full">
        <div class="flex justify-start items-center bg-gray-50 p-2">
            <div class="flex justify-start items-center">
                <span class="me-2">Zoom:</span>
                <button @click="zoomIn"
                    class="w-8 h-8 p-1 me-1 border border-collapse rounded-sm text-light-text-primary hover:bg-gray-100">
                    <PlusIcon></PlusIcon>
                </button>
                <button @click="zoomOut"
                    class="w-8 h-8 p-1 border border-collapse rounded-sm text-light-text-primary hover:bg-gray-100">
                    <MinusIcon></MinusIcon>
                </button>
                <button @click="restoreScale" class="ms-2 h-8 px-2 text-light-text-muted hover:bg-gray-100">Reset</button>
            </div>
            <div class="ms-4 flex justify-start items-center">
                <button @click="linkStyle = LINK_STYLE_CURVE" :class="{ 'bg-gray-100': linkStyle === LINK_STYLE_CURVE }"
                    class="w-8 h-8 p-1 me-1 border-0 rounded-sm text-light-text-primary hover:bg-gray-100">
                    <ArrowUturnDownIcon></ArrowUturnDownIcon>
                </button>
                <button @click="linkStyle = LINK_STYLE_STRAIT" :class="{ 'bg-gray-100': linkStyle === LINK_STYLE_STRAIT }"
                    class="w-8 h-8 p-1 border-0 rounded-sm text-light-text-primary hover:bg-gray-100">
                    <ArrowDownIcon></ArrowDownIcon>
                </button>
            </div>
            <div class="relative mx-4 flex-grow">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="search" v-model="searchTerm"
                    class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue-500"
                    placeholder="Search project tasks">
                <div role="status" class="flex items-center absolute inset-y-0 end-0 pe-3"
                    :class="searchLoading ? '' : 'hidden'">
                    <svg aria-hidden="true"
                        class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <div class="tree-container" ref="treeContainer">
            <svg class="svg vue-tree" ref="svgElement" :style="initialTransformStyle"></svg>
            <div class="dom-container" ref="domElement" :style="initialTransformStyle">
                <transition-group name="tree-node-item" tag="div">
                    <div class="node-slot" v-for="(node, index) of nodeDataList" :key="node.data.__id" :style="{
                        left: formatDimension(isVertical ? node.x : node.y),
                        top: formatDimension(isVertical ? node.y : node.x),
                        width: formatDimension(NODE_WIDTH),
                        height: formatDimension(NODE_HEIGHT),
                        zIndex: nodeDataList.length + 1 - index
                    }">
                        <div class="w-full mx-1 p-1 rounded-sm flex items-center"
                            :class="{ 'border-b-4 border-blue-500': node.data._collapsed, 'bg-green-300': node.data.progress === 100, 'bg-light-bg-highlight': node.data.progress !== 100, 'border-2 border-green-500': searchTerm && node.data.name.toLowerCase().indexOf(searchTerm) >= 0 }">
                            <div @click="onClickNode(index)" class="flex-grow text-ellipsis me-1">
                                {{ node.data.__id }} - {{ node.data.name }}
                                <div class="flex justify-between items-center">
                                    <div class="group relative flex justify-start items-center me-1 text-light-text-muted">
                                        <ArrowUpRightIcon class="w-4 h-4"></ArrowUpRightIcon>
                                        <span class="ms-[2px] text-light-text-secondary">{{ node.data.progress }} </span>
                                        <span
                                            class="group-hover:opacity-100 transition-opacity bg-gray-800 p-1 text-sm text-gray-100 rounded-sm absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">
                                            progress
                                        </span>
                                    </div>
                                    <div class="group relative flex justify-start items-center me-1 text-light-text-muted">
                                        <ScaleIcon class="w-4 h-4 inline-block"></ScaleIcon>
                                        <span class="ms-[2px] text-light-text-secondary">{{ node.data.weight }}</span>
                                        <span
                                            class="group-hover:opacity-100 transition-opacity bg-gray-800 p-1 text-sm text-gray-100 rounded-sm absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">
                                            weight
                                        </span>
                                    </div>
                                    <div class="group relative flex justify-start items-center me-1 text-light-text-muted">
                                        <CircleStackIcon class="w-4 h-4 inline-block"></CircleStackIcon>
                                        <span class="ms-[2px] text-light-text-secondary"> {{ node.data.points }}</span>
                                        <span
                                            class="group-hover:opacity-100 transition-opacity bg-gray-800 p-1 text-sm text-gray-100 rounded-sm absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">
                                            points
                                        </span>
                                    </div>
                                    <div class="group relative flex justify-start items-center text-light-text-muted">
                                        <LockOpenIcon v-if="node.data.auto_weight" class="w-4 h-4 inline-block">
                                        </LockOpenIcon>
                                        <LockClosedIcon v-else class="w-4 h-4 inline-block"></LockClosedIcon>
                                        <span
                                            class="group-hover:opacity-100 w-fit transition-opacity bg-gray-800 p-1 text-sm text-gray-100 rounded-sm absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">
                                            {{ node.data.auto_weight ? 'auto weight' : 'not auto weight' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div @mouseleave="selectedNodeIndex = -1" class="z-20 relative">
                                <button @mouseenter="selectedNodeIndex = index" class="p-1 rounded-full hover:bg-gray-200">
                                    <EllipsisVerticalIcon></EllipsisVerticalIcon>
                                </button>
                                <NodeOptionsMenu class="z-10" :index="index" :node="node" v-if="selectedNodeIndex === index"
                                    @show-new-task-modal="showNewTaskModal = true" 
                                    @duplicate-once="duplicateOnce(index)"
                                    @duplicate-n-times="showNTasksModal = true" 
                                    @edit-task="editTask(index)"
                                    @export-task-to-calendar="exportTaskToCalendar(index)"
                                    @export-task-to-inbox="exportTaskToInbox(index)" 
                                    @delete-task="showConfirmDeleteTaskDialog = true"
                                    @delete-subtasks="showConfirmDeleteTaskSubtasksDialog = true">
                                </NodeOptionsMenu>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
        <Teleport to="body">
            <ModalWrapper v-if="showNewTaskModal" @closeModal="showNewTaskModal = false">
                <NewTaskForm @submit="addSubtaskOffline"></NewTaskForm>
            </ModalWrapper>
        </Teleport>
        <Teleport to="body">
            <ModalWrapper v-if="showNTasksModal" @closeModal="showNTasksModal = false">
                <NTasksForm @submit="duplicateNTimes"></NTasksForm>
            </ModalWrapper>
        </Teleport>
        <Teleport to="body">
            <ModalWrapper v-if="showConfirmDeleteTaskDialog" @closeModal="showConfirmDeleteTaskDialog = false">
                <ConfirmDeletionDialog @delete="deleteSelectedTask">
                    <template v-slot:message>Are you sure to delete this task ?</template>
                </ConfirmDeletionDialog>
            </ModalWrapper>
        </Teleport>
        <Teleport to="body">
            <ModalWrapper v-if="showConfirmDeleteTaskSubtasksDialog" @closeModal="showConfirmDeleteTaskSubtasksDialog = false">
                <ConfirmDeletionDialog @delete="deleteSelectedTaskSubtasks">
                    <template v-slot:message>Are you sure to delete all the subtasks of this task ?</template>
                </ConfirmDeletionDialog>
            </ModalWrapper>
        </Teleport>
    </div>
</template>


<script setup>
import { computed, defineProps, ref, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import * as d3 from "d3"
import { ArrowDownIcon, ArrowUturnDownIcon, PlusIcon, MinusIcon, EllipsisVerticalIcon, ArrowUpRightIcon, ScaleIcon, CircleStackIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/vue/24/outline'
import NodeOptionsMenu from './NodeOptionsMenu.vue'
import ModalWrapper from '../modals/ModalWrapper.vue'
import NewTaskForm from '../modals/forms/NewTaskForm.vue'
import NTasksForm from '../modals/forms/NTasksForm.vue'
import ConfirmDeletionDialog from '../modals/dialog/ConfirmDeletionDialog.vue'
import useUID from '../../composables/useUID.js'


const { getUID } = useUID()

const props = defineProps({
    data: Object
    // {
    //     type: Object, default: () => {
    //         return { name: '', auto_weight: true, progress: 0, points: 1 }
    //     }
    // }
})

// const data = {
//     name: "Eve",
//     tasks: [
//         { name: "Cain", auto_weight: true, weight: 0.2, progress: 0, points: 4 },
//         { name: "Seth", tasks: [{ name: "Enos", progress: 100 }, { name: "Noam" }] },
//         { name: "Abel", auto_weight: true, weight: 0.2, progress: 40, points: 10 },
//         { name: "Awan", auto_weight: false, weight: 0.2, progress: 100, points: 4, tasks: [{ name: "Enoch" }] },
//         { name: "Azura", auto_weight: false, weight: 0.2, progress: 50, points: 3 }
//     ]
// };

// Constants
const NODE_WIDTH = 200;
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
const dataset = ref(props.data)
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

// Search
const searchTerm = ref('')
const searchLoading = ref(false)
// var timeoutId = setTimeout(() => { })

// watch(searchTerm, (value) => {
//     clearTimeout(timeoutId)
//     timeoutId = setTimeout(() => {

//     }, 500)
// })


// Methods
const deepCopy = (node) => {
    let obj = { _key: getUID() };
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

const updateDataset = (datasetValue) => {
    dataset.value = updatedInternalData(datasetValue);
    draw();
}

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
    if (!isVertical.value) {
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


// Dropdown Menu
const selectedNodeIndex = ref()
const lastSelectedNodeIndex = ref()
watch(selectedNodeIndex, (value) => {
    if (value !== -1) {
        lastSelectedNodeIndex.value = value
    }
})

watch(props.data, (value) => {
    console.log('props changed', value)
    updateDataset(value)
})

watch(linkStyle, (value, oldValue) => {
    // console.log('props changed', value)
    if (value !== oldValue) {
        draw()
    }
})


const showNewTaskModal = ref(false)
const showNTasksModal = ref(false)
const showConfirmDeleteTaskDialog = ref(false)
const showConfirmDeleteTaskSubtasksDialog = ref(false)

const addSubtaskToTask = inject('addSubtaskToTask')
const addSubtaskOffline = (task) => {
    // console.log('selectedNodeIndex.value =', lastSelectedNodeIndex.value)
    // console.log('nodeDataList =', nodeDataList.value)
    // console.log('nodeData =', nodeDataList.value[lastSelectedNodeIndex.value])
    const parentID = nodeDataList.value[lastSelectedNodeIndex.value].data.__id
    // console.log('task to add =', task)
    // const t = {...task}
    // t.__id = getUID()
    addSubtaskToTask(task, parentID)
    showNewTaskModal.value = false
}



// const addSubtask = (index) => {
//     console.log('add subtask to task: ', index)
// }

const duplicateTask = inject('duplicateTask')
const duplicateOnce = (index) => {
    const task = nodeDataList.value[index].data
    console.log('selected task =', task.__id)
    duplicateTask(task, 1)
}
const duplicateNTimes = (n) => {
    // console.log('duplicateNTimes ', index)
    const task = nodeDataList.value[lastSelectedNodeIndex.value].data
    duplicateTask(task, n)
    showNTasksModal.value = false
}
const editTask = (index) => {
    console.log('editTask ', index)
}
const exportTaskToCalendar = (index) => {
    console.log('duplicateNTimes ', index)
}
const exportTaskToInbox = (index) => {
    console.log('duplicateNTimes ', index)
}

const deleteTask = inject('deleteTask')
const deleteSelectedTask = () => {
    const id = nodeDataList.value[lastSelectedNodeIndex.value].data.__id
    deleteTask(id)
    showConfirmDeleteTaskDialog.value = false
}

const deleteTaskSubtasks = inject('deleteTaskSubtasks')
const deleteSelectedTaskSubtasks = () => {
    const id = nodeDataList.value[lastSelectedNodeIndex.value].data.__id
    deleteTaskSubtasks(id)
    showConfirmDeleteTaskSubtasksDialog.value = false
}


// lifecycle hooks
onMounted(() => {
    init()
})

onBeforeUnmount(() => {
    treeContainer.value = null
    svgElement.value = null
    domElement.value = null
})

const onClickNode = (index) => {
    const curNode = nodeDataList.value[index];
    // console.log(curNode.data)
    if (curNode.data.tasks) {
        curNode.data._tasks = curNode.data.tasks;
        curNode.data.tasks = null;
        curNode.data._collapsed = true;
    } else {
        curNode.data.tasks = curNode.data._tasks;
        curNode.data._tasks = null;
        curNode.data._collapsed = false;
    }
    draw();
    // nodeDataList.value = this.treeChartCore.getNodeDataList();
}

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
    height: 100%;
}

.tree-container .vue-tree {
    position: relative;
}

.tree-container .vue-tree,
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

button svg {
    position: relative !important;
    width: 22px !important;
    height: 22px !important;
}

/* .indication-icon {
    position: relative !important;
    width: 16px !important;
    height: 16px !important;
} */
</style>

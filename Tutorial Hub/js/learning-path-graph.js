// Learning Path Graph Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Lesson data with dependencies
    const lessons = [
        { id: 1, label: 'Intro to\nPseudocode', level: 'beginner', file: '01-introduction-to-pseudocode.html', group: 1, prereqs: [] },
        { id: 2, label: 'Getting\nStarted', level: 'beginner', file: '02-getting-started.html', group: 1, prereqs: [1] },
        { id: 3, label: 'Variables &\nData Types', level: 'beginner', file: '03-variables-and-data-types.html', group: 1, prereqs: [2] },
        { id: 4, label: 'Input &\nOutput', level: 'beginner', file: '04-input-and-output.html', group: 1, prereqs: [3] },
        { id: 5, label: 'Operators', level: 'beginner', file: '05-operators.html', group: 1, prereqs: [3] },
        { id: 6, label: 'Comments &\nDocumentation', level: 'beginner', file: '06-comments-and-documentation.html', group: 1, prereqs: [2] },
        
        { id: 7, label: 'Conditional\nStatements', level: 'intermediate', file: '07-conditional-statements.html', group: 2, prereqs: [5] },
        { id: 8, label: 'Loops', level: 'intermediate', file: '08-loops.html', group: 2, prereqs: [5] },
        { id: 9, label: 'Nested\nLoops', level: 'intermediate', file: '09-nested-loops.html', group: 2, prereqs: [8] },
        { id: 10, label: 'Functions', level: 'intermediate', file: '10-functions.html', group: 2, prereqs: [7, 8] },
        { id: 11, label: 'Procedures', level: 'intermediate', file: '11-procedures.html', group: 2, prereqs: [10] },
        { id: 12, label: 'Arrays', level: 'intermediate', file: '12-arrays.html', group: 2, prereqs: [8] },
        { id: 13, label: 'String\nOperations', level: 'intermediate', file: '13-string-operations.html', group: 2, prereqs: [3, 8] },
        
        { id: 14, label: 'Multidimensional\nArrays', level: 'advanced', file: '14-multidimensional-arrays.html', group: 3, prereqs: [12, 9] },
        { id: 15, label: 'Recursion', level: 'advanced', file: '15-recursion.html', group: 3, prereqs: [10] },
        { id: 16, label: 'Sorting\nAlgorithms', level: 'advanced', file: '16-sorting-algorithms.html', group: 3, prereqs: [12, 9] },
        { id: 17, label: 'Searching\nAlgorithms', level: 'advanced', file: '17-searching-algorithms.html', group: 3, prereqs: [12, 7] },
        { id: 18, label: 'Data\nStructures', level: 'advanced', file: '18-data-structures.html', group: 3, prereqs: [12] },
        { id: 19, label: 'Algorithm\nDesign Patterns', level: 'advanced', file: '19-algorithm-design-patterns.html', group: 3, prereqs: [15, 16, 17] },
        { id: 20, label: 'Best Practices\n& Optimization', level: 'advanced', file: '20-best-practices.html', group: 3, prereqs: [16, 17, 18] }
    ];

    // Get progress from localStorage
    function getLessonProgress() {
        const progress = JSON.parse(localStorage.getItem('lessonProgress')) || {};
        return progress;
    }

    // Get node color based on progress and level
    function getNodeColor(lesson, progress) {
        const lessonKey = `lesson-${lesson.id}`;
        const status = progress[lessonKey] || 'pending';

        // Base colors for progress
        const progressColors = {
            'completed': { background: '#10b981', border: '#059669', highlight: { background: '#34d399', border: '#10b981' } },
            'in-progress': { background: '#f59e0b', border: '#d97706', highlight: { background: '#fbbf24', border: '#f59e0b' } },
            'pending': { background: '#6b7280', border: '#4b5563', highlight: { background: '#9ca3af', border: '#6b7280' } }
        };

        // If not completed or in-progress, use level colors
        if (status === 'pending') {
            const levelColors = {
                'beginner': { background: '#22c55e', border: '#16a34a', highlight: { background: '#4ade80', border: '#22c55e' } },
                'intermediate': { background: '#3b82f6', border: '#2563eb', highlight: { background: '#60a5fa', border: '#3b82f6' } },
                'advanced': { background: '#9333ea', border: '#7e22ce', highlight: { background: '#a855f7', border: '#9333ea' } }
            };
            return levelColors[lesson.level];
        }

        return progressColors[status];
    }

    // Create nodes
    const progress = getLessonProgress();
    const nodes = lessons.map(lesson => ({
        id: lesson.id,
        label: lesson.label,
        title: `Lesson ${lesson.id}: ${lesson.label.replace(/\n/g, ' ')}\nLevel: ${lesson.level}\nClick to open`,
        color: getNodeColor(lesson, progress),
        font: { color: '#ffffff', size: 14, face: 'Inter', bold: true },
        shape: 'box',
        margin: 10,
        borderWidth: 3,
        borderWidthSelected: 4,
        file: lesson.file,
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.3)',
            size: 10,
            x: 0,
            y: 4
        }
    }));

    // Create edges (arrows showing dependencies)
    const edges = [];
    lessons.forEach(lesson => {
        lesson.prereqs.forEach(prereq => {
            edges.push({
                from: prereq,
                to: lesson.id,
                arrows: { to: { enabled: true, scaleFactor: 0.8 } },
                color: { color: 'rgba(147, 51, 234, 0.4)', highlight: 'rgba(147, 51, 234, 0.8)' },
                width: 2,
                smooth: { type: 'cubicBezier', roundness: 0.5 }
            });
        });
    });

    // Create a network
    const container = document.getElementById('network');
    const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
    
    let currentLayout = 'hierarchical';
    
    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                sortMethod: 'directed',
                levelSeparation: 150,
                nodeSpacing: 200,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true
            }
        },
        physics: {
            enabled: false
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            navigationButtons: false,
            keyboard: true,
            zoomView: true,
            dragView: true
        },
        nodes: {
            shape: 'box',
            margin: 10,
            widthConstraint: { minimum: 100, maximum: 150 },
            heightConstraint: { minimum: 60 }
        },
        edges: {
            smooth: {
                type: 'cubicBezier',
                roundness: 0.5
            }
        }
    };

    const network = new vis.Network(container, data, options);

    // Click handler - navigate to lesson
    network.on('click', function(params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const node = nodes.find(n => n.id === nodeId);
            if (node && node.file) {
                window.location.href = node.file;
            }
        }
    });

    // Hover effect - change cursor
    network.on('hoverNode', function() {
        container.style.cursor = 'pointer';
    });

    network.on('blurNode', function() {
        container.style.cursor = 'default';
    });

    // Control buttons
    document.getElementById('resetZoom').addEventListener('click', function() {
        network.moveTo({
            scale: 1,
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });
    });

    document.getElementById('fitView').addEventListener('click', function() {
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });
    });

    let physicsEnabled = false;
    document.getElementById('togglePhysics').addEventListener('click', function() {
        physicsEnabled = !physicsEnabled;
        network.setOptions({ physics: { enabled: physicsEnabled } });
        
        const btn = document.getElementById('togglePhysics');
        const icon = btn.querySelector('i');
        
        if (physicsEnabled) {
            icon.className = 'ri-pause-line';
            btn.classList.add('active');
        } else {
            icon.className = 'ri-play-line';
            btn.classList.remove('active');
        }
    });

    // View toggle
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            currentLayout = view;
            
            if (view === 'hierarchical') {
                network.setOptions({
                    layout: {
                        hierarchical: {
                            enabled: true,
                            direction: 'UD',
                            sortMethod: 'directed',
                            levelSeparation: 150,
                            nodeSpacing: 200,
                            treeSpacing: 200
                        }
                    },
                    physics: { enabled: false }
                });
            } else if (view === 'force') {
                network.setOptions({
                    layout: {
                        hierarchical: {
                            enabled: false
                        }
                    },
                    physics: {
                        enabled: true,
                        barnesHut: {
                            gravitationalConstant: -8000,
                            centralGravity: 0.3,
                            springLength: 200,
                            springConstant: 0.04,
                            damping: 0.09,
                            avoidOverlap: 0.5
                        },
                        stabilization: {
                            iterations: 200
                        }
                    }
                });
            }
        });
    });

    // Initial fit to view
    setTimeout(() => {
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });
    }, 500);

    // Update graph when progress changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'lessonProgress') {
            const newProgress = getLessonProgress();
            nodes.forEach((node, index) => {
                const lesson = lessons.find(l => l.id === node.id);
                if (lesson) {
                    const newColor = getNodeColor(lesson, newProgress);
                    data.nodes.update({ id: node.id, color: newColor });
                }
            });
        }
    });
});


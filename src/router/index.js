import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
    routes: [
        {
            name: '/',
            path: '/',
            component: resolve => require(['../components/main.vue'], resolve),
            redirect: 'Custom',
            children: [
                {
                    name: 'Custom',
                    path: '/Custom',
                    component: resolve => require(['../examples/custom/index.vue'], resolve)
                },
                {
                    name: 'Heatmap',
                    path: '/Heatmap',
                    component: resolve => require(['../examples/heatmap/index.vue'], resolve)
                }
            ],
        },
    ]
});
export default router;
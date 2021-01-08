<template>
	<view>
		<view class="status_bar">
			
		</view>
		<view class="cu-bar bg-gradual-blue header">
			<view class="action" @click="back">
				<text class="cuIcon-back text-white"></text> 返回
			</view>
			<view class="content text-bold">
				出厂名单
			</view>
			<view class="action" @click="clean">
				<button class="cu-btn round">清除记录</button>
			</view>
		</view>
		<view>
			<view>
				 <scroll-view croll-x="true">
					<t-table>
						<t-tr>
							<t-th>序号</t-th>
							<t-th>车牌号</t-th>
							<t-th>出厂时间</t-th>
						</t-tr>
						<t-tr v-for="(item,index) in table" :key="item.carNo">
							<t-td>{{ index+1 }}</t-td>
							<t-td>{{ item.carNo }}</t-td>
							<t-td>{{ item.time }}</t-td>
						</t-tr>
					</t-table>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	export default {
		data() {
			return {
				table:[]
			}
		},
		components:{
			tTable,
			tTh,
			tTr,
			tTd
		},
		created() {
			uni.getStorage({
			    key: 'out_list',
			    success: (res)=> {
			        console.log(res.data);
					this.table = res.data.outList;
			    }
			});
		},
		methods: {
			clean(){
				uni.removeStorage({
				    key: 'out_list',
				    success: (res)=> {
				        console.log('清除缓存列表成功');
						this.table = [];
				    }
				});
			},
			back(){
				uni.redirectTo({
					url: '/pages/index/index'
				});	
			}
		}
	}
</script>

<style>
</style>

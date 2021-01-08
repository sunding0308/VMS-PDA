<template>
	<view>
		<view class="status_bar">
			
		</view>
		<view class="cu-bar bg-gradual-blue header">
			<view class="action" @click="back">
				<text class="cuIcon-back text-white"></text> 返回
			</view>
			<view class="content text-bold">
				呼叫车辆-{{place}}
			</view>
		</view>
		<view>
			<view>
				 <scroll-view scroll-x="true">
					<t-table>
						<t-tr>
							<t-th>车牌号</t-th>
							<t-th>到位时间</t-th>
							<t-th>操作</t-th>
						</t-tr>
						<t-tr v-for="(item,index) in table" :key="item.CAR_LICENSE">
							<t-td>{{ item.CAR_LICENSE }}</t-td>
							<t-td>{{ item.FCHANGEDATE }}</t-td>
							<t-td><button class="cu-btn round bg-gradual-blue" @click="call(item.CAR_LICENSE,index)">呼叫</button></t-td>
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
	import Request from '../../plugins/pocky-request/index.js';
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
		computed:{
			place(){
				return this.$store.state.loadLocation;
			}
		},
		methods: {
			onLoad(){
				this.getWarehouseDetail();
			},
			getWarehouseDetail(){
				Request().post('', {
					header: {
						contentType: 'application/json'
					},
					data: {
						"SERVID": "05",
						"REQ": {
							LOAD_LOCATION: this.place
						}
					}
				}).then(res => {
					if (res.data.STATUS == "S") {
						this.table = res.data.ITEMS
					} else if (res.data.STATUS == "E") {
						uni.showToast({
							icon: 'none',
							title: res.data.MESSAGE
						});
					}
				}).catch(err => {
					console.error('is catch', err)
					uni.showToast({
						icon: 'none',
						title: err.errMsg
					});
				})
			},
			call(CAR_LICENSE,index){
				uni.showLoading({
					title: '处理中，请稍后...'
				});
				Request().post('', {
					header: {
						contentType: 'application/json'
					},
					data: {
						"SERVID": "03",
						"REQ": {
							"CAR_LICENSE": CAR_LICENSE,
							"BUSINESS_STATUS": "25"
						}
					}
				}).then(res => {
					if (res.data.STATUS == "S") {
						console.log(res)
						uni.showModal({
							content: res.data.MESSAGE,
							showCancel: false,
							success: (res)=> {
								if (res.confirm) {
									this.table.splice(index, 1);
								}
							}
						})
					} else if (res.data.STATUS == "E") {
						uni.showModal({
							content: res.data.MESSAGE,
							showCancel: false
						})
					}
					uni.hideLoading();
				}).catch(err => {
					console.error('is catch', err)
					uni.showModal({
						title: '异常',
						content: err.errMsg,
						showCancel: false
					})
					uni.hideLoading();
				})
			},
			back(){
				uni.redirectTo({
					url: '/pages/operate/callIndex'
				});	
			}
		}
	}
</script>

<style>
</style>

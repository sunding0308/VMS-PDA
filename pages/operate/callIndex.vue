<template>
	<view>
		<view class="status_bar">
			
		</view>
		<view class="cu-bar bg-gradual-blue header">
			<view class="action" @click="back">
				<text class="cuIcon-back text-white"></text> 返回
			</view>
			<view class="content text-bold">
				呼叫主页
			</view>
		</view>
		<view class="cu-list grid col-3">
			<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" @click="redirect(item.NAME)">
				<view class="cuIcon-home text-black">
					<view class="cu-tag badge" v-if="item.BADGE!=0">
						<block>{{item.BADGE>99?'99+':item.BADGE}}</block>
					</view>
				</view>
				<text>{{item.NAME}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Request from '../../plugins/pocky-request/index.js';
	export default {
		data() {
			return {
				cuIconList: []
			}
		},
		created() {
			this.getWarehouseInfo();
		},
		methods: {
			getWarehouseInfo(){
				Request().post('', {
					header: {
						contentType: 'application/json'
					},
					data: {
						"SERVID": "04",
						"REQ": {
							
						}
					}
				}).then(res => {
					if (res.data.STATUS == "S") {
						this.cuIconList = res.data.ITEMS
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
			redirect(place) {
				this.$store.commit('setPlace',place);
				uni.redirectTo({
					url: '/pages/operate/callEnter'
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

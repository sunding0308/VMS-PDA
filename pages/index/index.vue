<template>
	<view>
		<view class="status_bar">
			
		</view>
		<view class="cu-bar bg-gradual-blue header">
			<view class="content text-bold">
				首页
			</view>
		</view>
		<view class="cu-list grid col-3">
			<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" @click="redirect(item.path)">
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
				</view>
				<text>{{item.name}}</text>
			</view>
			<view class="cu-item" @click="logout">
				<view class="cuIcon-repeal text-black">
				</view>
				<text>退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cuIconList: [{
					cuIcon: 'deliver',
					color: 'olive',
					name: '车辆入厂',
					path: '/pages/operate/carEnter'
				}, {
					cuIcon: 'deliver',
					color: 'red',
					name: '车辆出厂',
					path: '/pages/operate/carOut'
				}, {
					cuIcon: 'notification',
					color: 'yellow',
					name: '呼叫入厂',
					path: '/pages/operate/callIndex'
				}, {
					cuIcon: 'list',
					color: 'blue',
					name: '出厂名单',
					path: '/pages/operate/outList'
				}],
			}
		},
		methods: {
			redirect(path){
				uni.redirectTo({
					url: path
				});	
			},
			logout() {
				uni.redirectTo({
					url: '/pages/login/login'
				});	
			}
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>

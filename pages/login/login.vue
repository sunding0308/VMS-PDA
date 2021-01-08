<template>
	<view>
		<form>
			<swiper class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
				</swiper-item>
			</swiper>
			<view class="cu-form-group padding">
				<view class="title">账号</view>
				<input placeholder="请输入账号" name="input" v-model="account"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">密码</view>
				<input placeholder="请输入密码" type="password" name="input" v-model="password"></input>
			</view>
			<view class="padding">
				<button class="cu-btn block bg-blue margin-tb-sm lg" type="" @click="login">登录</button>
			</view>
			<p class="copyright"> Copyright © 2020 物流车辆出入管理系统</p>
		</form>
	</view>
</template>

<script>
	import Request from '../../plugins/pocky-request/index.js';
	export default {
		data() {
			return {
				swiperList: [{
					id: 0,
					type: 'image',
					url: '/static/car.jpg'
				}],
				dotStyle: false,
				account:'',
				password:''
			}
		},
		methods: {
			login() {
				uni.showLoading({
					title: '登陆中，请稍后...'
				});

				if (this.account.length < 1) {
					uni.showToast({
						icon: 'none',
						title: '请输入账号'
					});
					return;
				}
				if (this.password.length < 1) {
					uni.showToast({
						icon: 'none',
						title: '请输入密码'
					});
					return;
				}
				Request().post('', {
					header: {
						contentType: 'application/json'
					},
					data: {
						"SERVID": "01",
						"REQ": {
							"USER_ID": this.account,
							"PWD": this.password
						}
					}
				}).then(res => {
					if (res.data.STATUS == "S") {
						uni.redirectTo({
							url: '/pages/index/index'
						});	
					} else if (res.data.STATUS == "E") {
						uni.showModal({
							title: '登录失败',
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
					this.err = err;
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style>
	.copyright{
		text-align: center;
		color: grey;
	}
	.uni-page-head{
        display: none;
    }
</style>

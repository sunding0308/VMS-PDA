<template>
	<view>
		<view class="status_bar">
			
		</view>
		<view class="cu-bar bg-gradual-blue header">
			<view class="action" @click="back">
				<text class="cuIcon-back text-white"></text> 返回
			</view>
			<view class="content text-bold">
				车辆入厂
			</view>
			<view class="action" @click="submit">
				<button class="cu-btn round">确认</button>
			</view>
		</view>
		<form>
			<view class="cu-form-group padding">
				<view class="title">二维码</view>
				<input placeholder="请扫描二维码" name="input" :focus="setFocus" v-model="qrcode" @confirm="qrcodeSearch"></input>
				<button class="cu-btn" @click="qrcodeSearch"><view class="cuIcon-search">
				</view></button>
			</view>
			<view class="cu-card case bottom-little-space" v-show="carLicense">
				<view class="cu-item bg-blue">
					<view class="cu-list">
						<view class="cu-item">
							<view class="content flex-sub">
								<view class="flex solid-bottom padding justify-around">
									<div class="qrcode" ref="qrcodeContainer"></div>
								</view>
								<view class="flex solid-bottom padding justify-around">
									<view class="text-black">车牌号：</view>
									<view class="text-black">{{this.carLicense}}</view>
								</view>
								<view class="flex solid-bottom padding justify-around">
									<view class="text-black">状态：</view>
									<view class="text-black"><view class='cu-tag line-red'>{{this.status}}</view></view>
								</view>
								<view class="flex solid-bottom padding justify-around">
									<view class="text-black">预约入场时间：</view>
									<view class="text-black">{{this.reservationEnterTime}}</view>
								</view>
								<view class="flex solid-bottom padding justify-around">
									<view class="text-black">业务类型：</view>
									<view class="text-black">{{this.businessType}}</view>
								</view>
								<view class="flex solid-bottom padding justify-around">
									<view class="text-black">装卸货地点：</view>
									<view class="text-black">{{this.loadingLocation}}</view>
								</view>
								<view class="flex solid-bottom padding justify-around">
									<view class="text-black">入厂原因：</view>
									<view class="text-black">{{this.remark}}</view>
								</view>
								<view class="flex solid-bottom padding justify-around">
									<view class="text-black">厂外财物：</view>
									<view class="text-black"><div v-html="this.notBelongsJt"></div></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import Request from '../../plugins/pocky-request/index.js';
	export default {
		data() {
			return {
				qrcode:'',
				carLicense:'',
				businessStatus:'',
				status:'',
				reservationEnterTime:'',
				businessType:'',
				loadingLocation:'',
				remark:'',
				notBelongsJt:'',
				setFocus:false
			}
		},
		mounted() {
			this.qrcodeFocus();
		},
		methods: {
			qrcodeFocus(){
				setTimeout(()=>{
					this.setFocus = true;
				},200);
			},
			resetFocus() {  
				this.setFocus = false;
			},
			cleanQrcode(){
				this.qrcode = '';
			},
			cleanAll(){
				this.qrcode = '';
				this.carLicense = '';
				this.businessStatus = '';
				this.status = '';
				this.reservationEnterTime = '';
				this.businessType = '';
				this.loadingLocation = '';
				this.remark = '';
				this.notBelongsJt = '';
			},
			qrcodeSearch(){
				//设置0.5s延时
				setTimeout(()=>{
					if (this.qrcode == "") {
						this.resetFocus();
						uni.showModal({
							title: '请输入车牌号',
							showCancel: false,
							success: (res)=> {
								if (res.confirm) {
									this.cleanQrcode();
									this.qrcodeFocus();
								}
							}
						});
						return;
					}
					uni.showLoading({
						title: '处理中，请稍后...'
					});
					Request().post('', {
						header: {
							contentType: 'application/json'
						},
						data: {
							"SERVID": "02",
							"REQ": {
								"QRCODE": this.qrcode
							}
						}
					}).then(res => {
						if (res.data.STATUS == "S") {
							console.log(res)
							this.carLicense = res.data.CAR_LICENSE ? res.data.CAR_LICENSE : '-';
							this.businessStatus = res.data.BUSINESS_STATUS ? res.data.BUSINESS_STATUS : '-';
							this.reservationEnterTime = res.data.RESERVATION_ENTER_TIME ? res.data.RESERVATION_ENTER_TIME : '-';
							this.businessType = res.data.BUSINESS_TYPE ? res.data.BUSINESS_TYPE : '-';
							this.loadingLocation = res.data.LOADING_LOCATION ? res.data.LOADING_LOCATION : '-';
							this.remark = res.data.remark ? res.data.remark : '-';
							this.notBelongsJt = '';
							res.data.ITEMS.forEach((item,index)=>{
								this.notBelongsJt += index+1+'.'+item.GOODSNAME+' '+item.WEIGHT+' '+item.UNIT+'<br/>';
							});
							this.getStatus();
							this.cleanQrcode();
						} else if (res.data.STATUS == "E") {
							uni.showModal({
								content: res.data.MESSAGE,
								showCancel: false,
								success: (res)=> {
									if (res.confirm) {
										this.cleanQrcode();
										this.qrcodeFocus();
									}
								}
							})
						}
						uni.hideLoading();
					}).catch(err => {
						console.error('is catch', err)
						uni.showModal({
							title: '异常',
							content: err.errMsg,
							showCancel: false,
							success: (res)=> {
								if (res.confirm) {
									this.cleanQrcode();
									this.qrcodeFocus();
								}
							}
						})
						uni.hideLoading();
					})
				},500);
			},
			submit(){
				if (this.carLicense == "") {
					uni.showModal({
						title: '没有要入厂的车辆信息',
						showCancel: false,
						success: (res)=> {
							if (res.confirm) {
								this.cleanQrcode();
								this.qrcodeFocus();
							}
						}
					});
					return;
				}
				if (this.businessStatus != 25) {
					uni.showModal({
						title: this.businessStatus+'|车辆未被呼叫入厂',
						showCancel: false,
						success: (res)=> {
							if (res.confirm) {
								this.cleanQrcode();
								this.qrcodeFocus();
							}
						}
					});
					return;
				}
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
							"CAR_LICENSE": this.carLicense,
							"BUSINESS_STATUS": "30"
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
									this.cleanAll();
									this.qrcodeFocus();
								}
							}
						})
					} else if (res.data.STATUS == "E") {
						uni.showModal({
							content: res.data.MESSAGE,
							showCancel: false,
							success: (res)=> {
								if (res.confirm) {
									this.cleanQrcode();
									this.qrcodeFocus();
								}
							}
						})
					}
					uni.hideLoading();
				}).catch(err => {
					console.error('is catch', err)
					uni.showModal({
						title: '异常',
						content: err.errMsg,
						showCancel: false,
						success: (res)=> {
							if (res.confirm) {
								this.cleanQrcode();
								this.qrcodeFocus();
							}
						}
					})
					uni.hideLoading();
				})
			},
			getStatus() {
				if (this.businessStatus == 10) {
					this.status = '预约'
				}
				if (this.businessStatus == 20) {
					this.status = '厂外排队'
				}
				if (this.businessStatus == 25) {
					this.status = '已呼叫入厂'
				}
				if (this.businessStatus == 30) {
					this.status = '场内排队'
				}
				if (this.businessStatus == 40) {
					this.status = '装卸任务中'
				}
				if (this.businessStatus == 50) {
					this.status = '等待出厂'
				}
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

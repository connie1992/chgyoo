package com.chgyoo.barret.service.impl;

import com.chgyoo.barret.service.LockSeatService;
import com.chgyoo.barret.util.RedisUtil;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.UUID;

/**
 * @author genchun.xiong01
 * Date: 2019/5/8
 */
@Service
public class LockSeatServiceImpl implements LockSeatService {

    private static final String LOCK = "Lock";

    private static final String CLIENT_ID = UUID.randomUUID().toString();

    @Resource
    private RedisUtil redisUtil;

    @Override
    public boolean lockSeat(String weixinId, String[] seatIds) {

        boolean lock = false;

        try {
            if (StringUtils.isEmpty(weixinId) || seatIds.length < 1) return false;

            int count = 0;

            // 选座加锁
            lock = redisUtil.tryLock(LOCK, CLIENT_ID, 30);

            // 如果有人正在选座，重试10次
            while (count < 10 && !lock) {
                Thread.currentThread().sleep(100);
                lock = redisUtil.tryLock(LOCK, CLIENT_ID, 30);
                count++;
            }

            if (!lock) return false;

            boolean result = true;

            for (int i = 0; i < seatIds.length; i++) {
                result = result && !redisUtil.hasKey(seatIds[i]);
            }

            if (result) {
                Arrays.stream(seatIds).forEach(s -> redisUtil.set(s, weixinId));
            }

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (lock) redisUtil.releaseLock(LOCK, CLIENT_ID);
        }
    }
}

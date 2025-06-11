package redisdb
import (
    "context"
    "github.com/redis/go-redis/v9"

    "encoding/json"
    "fmt"
)
var Ctx = context.Background()
var Client *redis.Client
func InitRedis() {
	ctx := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis-18562.c263.us-east-1-2.ec2.redns.redis-cloud.com:18562",
		Username: "default",
		Password: "ltwOCmdBjVNSY0Sy6PD4fuT2JMitCknv",
		DB:       0,
	})

	rdb.Set(ctx, "foo", "bar", 0)
	result, err := rdb.Get(ctx, "foo").Result()

	if err != nil {
		panic(err)
	}

	fmt.Println(result)

}

func Publish(channel string, message interface{}) error {
    data, err := json.Marshal(message)
    if err != nil {
        return err
    }
    return Client.Publish(Ctx, channel, data).Err()
}

func Subscribe(channel string, handleMessage func(msg []byte)) {
    pubsub := Client.Subscribe(Ctx, channel)
    go func() {
        for msg := range pubsub.Channel() {
            handleMessage([]byte(msg.Payload))
        }
    }()
}